import { db } from "./db"
import { decrypt } from "./crypto"
import { fetchRepoMeta, fetchAllStars, GitHubError, type StarEvent } from "./github"
import { buildHistory } from "./history"

const SYNC_COOLDOWN_MS = 60 * 60 * 1000

export async function syncRepository(repoId: string, { force = false } = {}) {
  const repo = await db.repository.findUniqueOrThrow({
    where: { id: repoId },
    include: { token: true },
  })

  if (!repo.token) return

  const token = decrypt(repo.token.encryptedToken)

  if (!force && repo.lastSyncedAt) {
    const elapsed = Date.now() - repo.lastSyncedAt.getTime()
    if (elapsed < SYNC_COOLDOWN_MS) {
      let meta
      try {
        meta = await fetchRepoMeta(repo.owner, repo.name, token)
      } catch {
        return
      }
      if (meta.stargazers_count === repo.stargazerCount) return
      await runSync(repoId, repo.owner, repo.name, token)
      return
    }
  }

  let meta
  try {
    meta = await fetchRepoMeta(repo.owner, repo.name, token)
  } catch {
    return
  }

  if (!force && meta.stargazers_count === repo.stargazerCount && repo.lastSyncedAt) {
    await db.repository.update({
      where: { id: repoId },
      data: {
        description: meta.description,
        homepage: meta.homepage,
        defaultBranch: meta.default_branch,
        githubUrl: meta.html_url,
        ownerAvatar: meta.owner.avatar_url,
        ownerLogin: meta.owner.login,
        visibility: meta.visibility,
        lastSyncedAt: new Date(),
      },
    })
    return
  }

  await runSync(repoId, repo.owner, repo.name, token)
}

async function runSync(repoId: string, owner: string, name: string, token: string) {
  let stars: StarEvent[]
  try {
    stars = await fetchAllStars(owner, name, token)
  } catch (e) {
    if (e instanceof GitHubError) return
    throw e
  }

  let meta
  try {
    meta = await fetchRepoMeta(owner, name, token)
  } catch {
    return
  }

  await db.repository.update({
    where: { id: repoId },
    data: {
      starHistory: buildHistory(stars),
      stargazerCount: meta.stargazers_count,
      description: meta.description,
      homepage: meta.homepage,
      defaultBranch: meta.default_branch,
      githubUrl: meta.html_url,
      ownerAvatar: meta.owner.avatar_url,
      ownerLogin: meta.owner.login,
      visibility: meta.visibility,
      lastSyncedAt: new Date(),
    },
  })
}

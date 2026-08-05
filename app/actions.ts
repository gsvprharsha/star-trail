"use server"

import { db } from "@/lib/db"
import { encrypt } from "@/lib/crypto"
import { fetchRepoMeta, fetchAllStars, GitHubError } from "@/lib/github"
import { syncRepository } from "@/lib/sync"
import { buildHistory } from "@/lib/history"

type ActionError = { code: string; message: string }
type ActionResult<T = void> = { success: true; data: T } | { success: false; error: ActionError }

function parseRepoInput(input: string): { owner: string; name: string } {
  const cleaned = input.trim().replace(/\.git$/, "").replace(/\/$/, "")
  const match = cleaned.match(/(?:github\.com\/)?([\w.-]+)\/([\w.-]+)$/)
  if (!match) throw new Error("Invalid format. Use owner/repo or a GitHub URL.")
  return { owner: match[1], name: match[2] }
}

export async function registerRepository(
  repoInput: string,
  pat: string,
): Promise<ActionResult<{ id: string; owner: string; name: string }>> {
  try {
    const { owner, name } = parseRepoInput(repoInput)
    const normalized = `${owner.toLowerCase()}/${name.toLowerCase()}`

    let meta
    try {
      meta = await fetchRepoMeta(owner, name, pat)
    } catch (e) {
      if (e instanceof GitHubError) return { success: false, error: { code: e.code, message: e.message } }
      throw e
    }

    const existing = await db.repository.findUnique({ where: { normalized } })

    if (existing) {
      await db.token.upsert({
        where: { repositoryId: existing.id },
        create: { repositoryId: existing.id, encryptedToken: encrypt(pat) },
        update: { encryptedToken: encrypt(pat) },
      })
      await syncRepository(existing.id, { force: true })
      return { success: true, data: { id: existing.id, owner: existing.owner, name: existing.name } }
    }

    const repo = await db.repository.create({
      data: {
        owner,
        name,
        normalized,
        description: meta.description,
        homepage: meta.homepage,
        defaultBranch: meta.default_branch,
        githubUrl: meta.html_url,
        stargazerCount: meta.stargazers_count,
        ownerAvatar: meta.owner.avatar_url,
        ownerLogin: meta.owner.login,
        visibility: meta.visibility,
        token: { create: { encryptedToken: encrypt(pat) } },
      },
    })

    let starHistory: ReturnType<typeof buildHistory> = []
    try {
      starHistory = buildHistory(await fetchAllStars(owner, name, pat))
    } catch (e) {
      if (!(e instanceof GitHubError)) throw e
    }

    await db.repository.update({
      where: { id: repo.id },
      data: { starHistory, lastSyncedAt: new Date() },
    })
    return { success: true, data: { id: repo.id, owner, name } }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "An unexpected error occurred."
    console.error("registerRepository:", e)
    return { success: false, error: { code: "INTERNAL_ERROR", message: msg } }
  }
}

export async function updateToken(repoId: string, pat: string): Promise<ActionResult> {
  try {
    const repo = await db.repository.findUnique({ where: { id: repoId } })
    if (!repo) return { success: false, error: { code: "NOT_FOUND", message: "Repository not found." } }

    try {
      await fetchRepoMeta(repo.owner, repo.name, pat)
    } catch (e) {
      if (e instanceof GitHubError) return { success: false, error: { code: e.code, message: e.message } }
      throw e
    }

    await db.token.upsert({
      where: { repositoryId: repoId },
      create: { repositoryId: repoId, encryptedToken: encrypt(pat) },
      update: { encryptedToken: encrypt(pat) },
    })

    return { success: true, data: undefined }
  } catch (e) {
    console.error("updateToken:", e)
    return { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } }
  }
}

export async function manualSync(repoId: string): Promise<ActionResult> {
  try {
    const repo = await db.repository.findUnique({ where: { id: repoId } })
    if (!repo) return { success: false, error: { code: "NOT_FOUND", message: "Repository not found." } }

    await syncRepository(repoId, { force: true })
    return { success: true, data: undefined }
  } catch (e) {
    console.error("manualSync:", e)
    return { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } }
  }
}

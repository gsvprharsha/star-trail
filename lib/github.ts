export interface RepoMeta {
  description: string | null
  homepage: string | null
  default_branch: string
  html_url: string
  stargazers_count: number
  owner: { avatar_url: string; login: string }
  visibility: string
}

export interface StarEvent {
  starred_at: string
  user: { login: string }
}

export class GitHubError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message)
  }
}

async function ghFetch(url: string, token: string, accept: string): Promise<Response> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: accept,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  })
  if (!res.ok) {
    if (res.status === 401) throw new GitHubError("INVALID_TOKEN", "GitHub token is invalid or expired.")
    if (res.status === 403) throw new GitHubError("FORBIDDEN", "GitHub token lacks required permissions.")
    if (res.status === 404) throw new GitHubError("NOT_FOUND", "Repository not found or not accessible.")
    throw new GitHubError("GITHUB_ERROR", `GitHub API error: ${res.status}`)
  }
  return res
}

export async function fetchRepoMeta(owner: string, repo: string, token: string): Promise<RepoMeta> {
  const res = await ghFetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    token,
    "application/vnd.github+json",
  )
  return res.json()
}

// ponytail: 500 page limit (~50k stars max), add streaming/queue when needed
const MAX_PAGES = 500

export async function fetchAllStars(owner: string, repo: string, token: string): Promise<StarEvent[]> {
  const stars: StarEvent[] = []

  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await ghFetch(
      `https://api.github.com/repos/${owner}/${repo}/stargazers?per_page=100&page=${page}`,
      token,
      "application/vnd.github.star+json",
    )
    const data: StarEvent[] = await res.json()
    stars.push(...data)
    if (data.length < 100) break
    if (page === MAX_PAGES) {
      throw new GitHubError(
        "TOO_LARGE",
        "Repository has more than 50,000 stars and cannot be fully imported in one request.",
      )
    }
  }

  return stars
}

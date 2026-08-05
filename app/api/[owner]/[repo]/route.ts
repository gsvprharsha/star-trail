import { type NextRequest, NextResponse } from "next/server"

import { db } from "@/lib/db"
import { syncRepository } from "@/lib/sync"
import { toSeries } from "@/lib/history"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  const { owner, repo } = await params
  const normalized = `${owner.toLowerCase()}/${repo.toLowerCase()}`

  const repository = await db.repository.findUnique({ where: { normalized } })

  if (!repository) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Repository not registered." } },
      { status: 404 },
    )
  }

  await syncRepository(repository.id).catch(console.error)

  const fresh = await db.repository.findUniqueOrThrow({ where: { id: repository.id } })

  return NextResponse.json({
    id: fresh.id,
    owner: fresh.owner,
    name: fresh.name,
    description: fresh.description,
    homepage: fresh.homepage,
    githubUrl: fresh.githubUrl,
    stargazerCount: fresh.stargazerCount,
    ownerAvatar: fresh.ownerAvatar,
    ownerLogin: fresh.ownerLogin,
    visibility: fresh.visibility,
    lastSyncedAt: fresh.lastSyncedAt,
    snapshots: toSeries(fresh.starHistory),
  })
}

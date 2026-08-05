import { type NextRequest, NextResponse } from "next/server"

import { generateStarChart } from "@/lib/chart"
import { db } from "@/lib/db"
import { toSeries } from "@/lib/history"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  const { owner, repo } = await params
  const normalized = `${owner.toLowerCase()}/${repo.toLowerCase()}`
  const sp = req.nextUrl.searchParams

  const theme = sp.get("theme") === "light" ? "light" : ("dark" as const)
  const width = clamp(parseInt(sp.get("width") ?? "800", 10) || 800, 200, 2000)
  const height = clamp(parseInt(sp.get("height") ?? "300", 10) || 300, 100, 1000)

  const repository = await db.repository.findUnique({ where: { normalized } })

  if (!repository) {
    return new NextResponse(notFoundSvg(width, height), {
      status: 404,
      headers: { "Content-Type": "image/svg+xml" },
    })
  }

  const svg = generateStarChart(toSeries(repository.starHistory), `${repository.owner}/${repository.name}`, {
    theme,
    width,
    height,
  })

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function notFoundSvg(w: number, h: number) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#0a0a0a" rx="8"/>
  <text x="${w / 2}" y="${h / 2}" text-anchor="middle" fill="#e6edf3" font-family="system-ui,sans-serif" font-size="14" opacity="0.4">Repository not found</text>
</svg>`
}

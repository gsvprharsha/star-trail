import { ImageResponse } from "next/og"

import { generateStarChart } from "@/lib/chart"
import { db } from "@/lib/db"
import { toSeries } from "@/lib/history"

export const alt = "Star history chart"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const BG = "#0a0a0a"
const FG = "#e6edf3"
const ACCENT = "#e3b341"

export default async function Image({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>
}) {
  const { owner, repo } = await params
  const repository = await db.repository.findUnique({
    where: { normalized: `${owner.toLowerCase()}/${repo.toLowerCase()}` },
    select: { owner: true, name: true, stargazerCount: true, description: true, starHistory: true },
  })

  const title = repository ? `${repository.owner}/${repository.name}` : `${owner}/${repo}`

  // Reuse the embed chart renderer. Its <text> nodes are stripped: resvg renders nested
  // SVG images without a reliable font stack, so labels come from the JSX below instead.
  const chartSvg = generateStarChart(toSeries(repository?.starHistory), "", {
    theme: "dark",
    width: 1080,
    height: 300,
  }).replace(/<text[\s\S]*?<\/text>/g, "")

  const chartUrl = `data:image/svg+xml;base64,${Buffer.from(chartSvg).toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: 60,
          fontFamily: "sans-serif",
          color: FG,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Star size={26} />
            <span style={{ fontSize: 22, letterSpacing: 4, opacity: 0.6 }}>STAR TRAIL</span>
          </div>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 700 }}>{title}</div>
          {repository?.description && (
            <div style={{ display: "flex", fontSize: 24, opacity: 0.5 }}>
              {repository.description.slice(0, 90)}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
            <Star size={30} />
            <span style={{ fontSize: 38, fontWeight: 600, color: ACCENT }}>
              {(repository?.stargazerCount ?? 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 26, opacity: 0.5 }}>stars</span>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={chartUrl} width={1080} height={300} alt="" />
      </div>
    ),
    size,
  )
}

function Star({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={ACCENT}>
      <path d="M12 1.5l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.27l-6.18 3.23L7 13.63l-5-4.87 6.91-1z" />
    </svg>
  )
}

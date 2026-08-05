"use client"

import { Area } from "@/components/dither-kit/area"
import { AreaChart } from "@/components/dither-kit/area-chart"
import { Grid } from "@/components/dither-kit/grid"
import { Tooltip } from "@/components/dither-kit/tooltip"
import { XAxis } from "@/components/dither-kit/x-axis"
import { YAxis } from "@/components/dither-kit/y-axis"

const config = { stars: { label: "Stars", color: "orange" as const } }

interface Props {
  snapshots: { date: string; count: number }[]
  caption?: string
}

export function StarChart({ snapshots, caption = "Graph by star-trail.fun" }: Props) {
  if (snapshots.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No stars yet.</p>
  }

  const sorted = [...snapshots].sort((a, b) => a.date.localeCompare(b.date))
  const first = new Date(sorted[0].date)
  const last = new Date(sorted[sorted.length - 1].date)
  const rangeYears = (last.getTime() - first.getTime()) / (365.25 * 24 * 60 * 60 * 1000)

  // More data points → natural bumps. Daily for <1yr, keep all points otherwise.
  const data = sorted.map((s) => {
    const d = new Date(s.date)
    const label =
      rangeYears < 1
        ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : d.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
    return { label, stars: s.count }
  })

  const fmtY = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : String(v)

  const current = sorted[sorted.length - 1].count

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex justify-end">
        <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
          <span
            aria-hidden
            className="size-3 rounded-[2px]"
            style={{ background: "rgb(255,150,50)" }}
          />
          {current.toLocaleString()}
        </span>
      </div>
      <div className="h-64 w-full">
        <AreaChart data={data} config={config} bloom="low" bloomOnHover animate>
          <Grid />
          <Area dataKey="stars" variant="gradient" />
          <XAxis dataKey="label" maxTicks={8} />
          <YAxis tickFormatter={fmtY} />
          <Tooltip labelKey="label" valueFormatter={(v) => v.toLocaleString()} />
        </AreaChart>
      </div>
      <p className="text-right text-xs text-white/20">{caption}</p>
    </div>
  )
}

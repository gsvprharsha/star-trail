import {
  BAYER,
  BORDER_ALPHA,
  CELL,
  MAX_COLS,
  MAX_ROWS,
  OFF_TIER,
} from "@/components/dither-kit/dither-paint"
import { type DitherColor, PALETTE } from "@/components/dither-kit/palette"

interface ChartOptions {
  theme?: "dark" | "light"
  width?: number
  height?: number
  color?: DitherColor
}

const PAD = { top: 32, right: 24, bottom: 40, left: 52 }
const FONT_SANS = "'Geist', ui-sans-serif, system-ui, sans-serif"
const FONT_MONO = "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
// @import lets standalone SVG viewers pull Geist from Google Fonts; when the
// SVG is embedded via <img> (READMEs) browsers block external font fetches, so
// the font-family stack falls back to whatever Geist/Geist Mono the user has
// locally, then to system UI fonts.
const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;600&family=Geist+Mono&display=swap');"

export function generateStarChart(
  snapshots: { snapshotDate: Date; starCount: number }[],
  repoName: string,
  options: ChartOptions = {},
): string {
  const {
    theme = "dark",
    width = 800,
    height = 300,
    color = "orange",
  } = options

  const isDark = theme === "dark"
  const bg = isDark ? "#0a0a0a" : "#ffffff"
  const fg = isDark ? "#e6edf3" : "#1f2328"
  const grid = isDark ? "#21262d" : "#d0d7de"

  const sorted = [...snapshots].sort(
    (a, b) => a.snapshotDate.getTime() - b.snapshotDate.getTime(),
  )
  if (sorted.length === 0) return emptySvg(width, height, bg, fg, "No stars yet")

  const cw = width - PAD.left - PAD.right
  const ch = height - PAD.top - PAD.bottom
  const cols = Math.min(MAX_COLS, Math.max(8, Math.round(cw / CELL)))
  const rows = Math.min(MAX_ROWS, Math.max(8, Math.round(ch / CELL)))

  const minT = sorted[0].snapshotDate.getTime()
  const maxT = sorted[sorted.length - 1].snapshotDate.getTime()
  const tRange = maxT - minT || 1
  const maxCount = sorted[sorted.length - 1].starCount || 1

  // Sample star count at each backing column via linear interpolation in time.
  const top = new Array<number>(cols)
  let si = 0
  for (let x = 0; x < cols; x++) {
    const t = minT + (x / Math.max(cols - 1, 1)) * tRange
    while (si + 1 < sorted.length && sorted[si + 1].snapshotDate.getTime() <= t)
      si++
    const a = sorted[si]
    const b = sorted[Math.min(si + 1, sorted.length - 1)]
    const denom = b.snapshotDate.getTime() - a.snapshotDate.getTime() || 1
    const f = (t - a.snapshotDate.getTime()) / denom
    const c = a.starCount + (b.starCount - a.starCount) * f
    top[x] = Math.round((1 - c / maxCount) * (rows - 1))
  }

  // Dither cells → 8 alpha buckets → 8 paths. Mirrors paintColumn in
  // dither-paint.ts for variant="gradient", no hover/dim/stack/sparse.
  const BUCKETS = 8
  const buckets: string[] = Array.from({ length: BUCKETS }, () => "")
  const push = (alpha: number, x: number, y: number) => {
    const idx = Math.min(BUCKETS - 1, Math.max(0, Math.floor(alpha * BUCKETS)))
    buckets[idx] += `M${x} ${y}h1v1h-1z`
  }
  const floor = rows - 1
  for (let x = 0; x < cols; x++) {
    const t = top[x]
    const depth = floor - t
    if (depth <= 0) {
      push(BORDER_ALPHA, x, t)
      continue
    }
    for (let y = t; y < floor; y++) {
      const density = (y - t) / depth
      const lit = density > BAYER[y & 3][x & 3]
      const k = 0.3 + density * 0.7
      push(lit ? k : k * OFF_TIER, x, y)
    }
    push(BORDER_ALPHA, x, t)
    if (depth > 1) push(BORDER_ALPHA * 0.5, x, t + 1)
  }

  const seed = PALETTE[color]
  const fill = `rgb(${seed.fill.join(",")})`
  const scaleX = cw / cols
  const scaleY = ch / rows

  const dither = buckets
    .map((d, i) =>
      d
        ? `<path d="${d}" fill-opacity="${((i + 0.5) / BUCKETS).toFixed(3)}"/>`
        : "",
    )
    .join("")

  const yTicks = niceTicks(maxCount, 4)
  const gridEls = yTicks
    .map((v) => {
      const y = PAD.top + ch - (v / maxCount) * ch
      return `<line x1="${PAD.left}" y1="${y.toFixed(1)}" x2="${PAD.left + cw}" y2="${y.toFixed(1)}" stroke="${grid}" stroke-width="1" stroke-dasharray="3 3" opacity="0.6"/><text x="${PAD.left - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" fill="${fg}" font-family="${FONT_MONO}" font-size="11" opacity="0.6">${fmt(v)}</text>`
    })
    .join("")

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs><style>${FONT_IMPORT}</style></defs>
  <rect width="${width}" height="${height}" fill="${bg}" rx="8"/>
  ${gridEls}
  <g transform="translate(${PAD.left} ${PAD.top}) scale(${scaleX} ${scaleY})" fill="${fill}" shape-rendering="crispEdges">${dither}</g>
  <text x="${PAD.left}" y="20" fill="${fg}" font-family="${FONT_SANS}" font-size="13" font-weight="600" opacity="0.9">${escapeXml(repoName)}</text>
  <text x="${PAD.left + cw}" y="20" text-anchor="end" fill="${fg}" font-family="${FONT_MONO}" font-size="12" opacity="0.5">★ ${maxCount.toLocaleString()}</text>
</svg>`
}

function niceTicks(max: number, count: number): number[] {
  if (max <= 0) return [0]
  const step = niceStep(max / count)
  const out: number[] = []
  for (let v = 0; v <= max + step * 0.001; v += step) out.push(Math.round(v))
  return out
}

function niceStep(raw: number): number {
  const p = Math.pow(10, Math.floor(Math.log10(raw)))
  const n = raw / p
  const nice = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10
  return nice * p
}

function fmt(v: number) {
  return v >= 1000
    ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`
    : String(v)
}

function emptySvg(w: number, h: number, bg: string, fg: string, msg: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><style>${FONT_IMPORT}</style></defs>
  <rect width="${w}" height="${h}" fill="${bg}" rx="8"/>
  <text x="${w / 2}" y="${h / 2}" text-anchor="middle" fill="${fg}" font-family="${FONT_SANS}" font-size="14" opacity="0.5">${msg}</text>
</svg>`
}

function escapeXml(s: string) {
  return s.replace(
    /[<>&'"]/g,
    (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[
        c
      ]!,
  )
}

// ponytail: dither emitted as ~8 paths grouped by alpha bucket (rung 6/7 —
// no server canvas dep). Upgrade to node-canvas + PNG if payload size or the
// bloom/stars layer starts to matter.

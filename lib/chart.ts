interface ChartOptions {
  theme?: "dark" | "light"
  width?: number
  height?: number
}

export function generateStarChart(
  snapshots: { snapshotDate: Date; starCount: number }[],
  repoName: string,
  options: ChartOptions = {},
): string {
  const { theme = "dark", width = 800, height = 300 } = options

  const isDark = theme === "dark"
  const bg = isDark ? "#0a0a0a" : "#ffffff"
  const fg = isDark ? "#e6edf3" : "#1f2328"
  const accent = isDark ? "#e3b341" : "#9a6700"
  const grid = isDark ? "#21262d" : "#d0d7de"

  const sorted = [...snapshots].sort((a, b) => a.snapshotDate.getTime() - b.snapshotDate.getTime())

  if (sorted.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bg}" rx="8"/>
  <text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="${fg}" font-family="system-ui,sans-serif" font-size="14" opacity="0.5">No stars yet</text>
</svg>`
  }

  const PAD = { top: 32, right: 24, bottom: 40, left: 52 }
  const cw = width - PAD.left - PAD.right
  const ch = height - PAD.top - PAD.bottom

  const minT = sorted[0].snapshotDate.getTime()
  const maxT = sorted[sorted.length - 1].snapshotDate.getTime()
  const tRange = maxT - minT || 1
  const maxCount = sorted[sorted.length - 1].starCount

  const toX = (t: number) => PAD.left + ((t - minT) / tRange) * cw
  const toY = (c: number) => PAD.top + ch - (c / maxCount) * ch

  const pts = sorted.map((s) => `${toX(s.snapshotDate.getTime()).toFixed(1)},${toY(s.starCount).toFixed(1)}`)

  const firstX = toX(minT).toFixed(1)
  const lastX = toX(maxT).toFixed(1)
  const bottom = (PAD.top + ch).toFixed(1)
  const areaPath = `M${firstX},${bottom} L${pts.join(" L")} L${lastX},${bottom} Z`

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((p) => Math.round(maxCount * p))
  const gridLines = yTicks
    .map((v) => {
      const y = toY(v).toFixed(1)
      const label = v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : String(v)
      return `<line x1="${PAD.left}" y1="${y}" x2="${PAD.left + cw}" y2="${y}" stroke="${grid}" stroke-width="1"/>
  <text x="${PAD.left - 8}" y="${(toY(v) + 4).toFixed(1)}" text-anchor="end" fill="${fg}" font-family="system-ui,sans-serif" font-size="11" opacity="0.6">${label}</text>`
    })
    .join("\n  ")

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bg}" rx="8"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  ${gridLines}
  <path d="${areaPath}" fill="url(#g)"/>
  <polyline points="${pts.join(" ")}" fill="none" stroke="${accent}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
  <text x="${PAD.left}" y="20" fill="${fg}" font-family="system-ui,sans-serif" font-size="13" font-weight="600" opacity="0.9">${repoName}</text>
  <text x="${PAD.left + cw}" y="20" text-anchor="end" fill="${fg}" font-family="system-ui,sans-serif" font-size="12" opacity="0.5">★ ${maxCount.toLocaleString()}</text>
</svg>`
}

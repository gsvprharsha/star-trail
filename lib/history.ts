export type StarHistory = { d: string; c: number }[]

// Raw star events -> cumulative daily counts, ordered ascending. Stored as the repo's starHistory JSON.
export function buildHistory(stars: { starred_at: string }[]): StarHistory {
  const dayCounts = new Map<string, number>()
  for (const s of stars) {
    const d = new Date(s.starred_at)
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`
    dayCounts.set(key, (dayCounts.get(key) ?? 0) + 1)
  }
  let cumulative = 0
  return [...dayCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([d, count]) => {
      cumulative += count
      return { d, c: cumulative }
    })
}

// starHistory JSON column -> chart series. Tolerant of null/legacy shapes.
export function toSeries(history: unknown): { snapshotDate: Date; starCount: number }[] {
  if (!Array.isArray(history)) return []
  return (history as StarHistory).map((p) => ({ snapshotDate: new Date(p.d), starCount: p.c }))
}

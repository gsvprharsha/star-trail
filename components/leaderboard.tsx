import Link from "next/link"
import { StarIcon } from "lucide-react"

import { db } from "@/lib/db"
import { toSeries } from "@/lib/history"
import { Sparkline } from "@/components/dither-kit/sparkline"

export async function Leaderboard() {
  const repos = await db.repository.findMany({
    orderBy: { stargazerCount: "desc" },
    take: 10,
    select: {
      owner: true,
      name: true,
      description: true,
      stargazerCount: true,
      ownerAvatar: true,
      ownerLogin: true,
      starHistory: true,
    },
  })

  if (repos.length === 0) return null

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <StarIcon className="size-4 fill-[#e3b341] text-[#e3b341]" />
        <h2 className="font-semibold tracking-tight">Leaderboard</h2>
        <span className="text-sm text-muted-foreground">Top 10 most-starred tracked repos</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {repos.map((repo, i) => {
          const series = toSeries(repo.starHistory).map((s) => s.starCount)
          return (
            <Link
              key={`${repo.owner}/${repo.name}`}
              href={`/${repo.owner}/${repo.name}`}
              className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-colors hover:border-[#e3b341]/50"
            >
              <div className="flex items-center gap-2.5 p-4">
                <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                  #{i + 1}
                </span>
                {repo.ownerAvatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={repo.ownerAvatar}
                    alt={repo.ownerLogin ?? repo.owner}
                    className="size-6 shrink-0 rounded-full"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {repo.owner}/{repo.name}
                  </div>
                </div>
              </div>

              {series.length > 0 && (
                <div className="h-24 w-full">
                  <Sparkline data={series} color="orange" bloom="low" />
                </div>
              )}

              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-center gap-1.5 text-sm tabular-nums text-muted-foreground">
                  <StarIcon className="size-5 fill-[#e3b341] text-[#e3b341]" />
                  <span className="font-medium text-foreground">
                    {repo.stargazerCount.toLocaleString()}
                  </span>
                </div>
                {repo.description && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">{repo.description}</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

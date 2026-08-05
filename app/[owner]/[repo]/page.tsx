import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon, ExternalLinkIcon, RefreshCwIcon, StarIcon } from "lucide-react"

import { db } from "@/lib/db"
import { syncRepository } from "@/lib/sync"
import { toSeries } from "@/lib/history"
import { manualSync } from "@/app/actions"
import { StarChart } from "@/components/star-chart"
import { ChartActions } from "@/components/chart-actions"
import { EmbedSnippet } from "@/components/embed-snippet"
import { UpdateTokenForm } from "@/components/update-token-form"
import { SiteHeader } from "@/components/site-header"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Props {
  params: Promise<{ owner: string; repo: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, repo } = await params
  const found = await db.repository.findUnique({
    where: { normalized: `${owner.toLowerCase()}/${repo.toLowerCase()}` },
    select: { owner: true, name: true, stargazerCount: true },
  })

  const title = `${found?.owner ?? owner}/${found?.name ?? repo} — Star Trail`
  const description = found
    ? `${found.stargazerCount.toLocaleString()} stars. Track its star growth on Star Trail.`
    : "Track GitHub repository star history."

  // Images come from ./opengraph-image.tsx (file convention wins over anything set here).
  // X has no twitter-image, so it falls back to og:image — this card type makes it full-width.
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function RepoPage({ params }: Props) {
  const { owner, repo } = await params
  const normalized = `${owner.toLowerCase()}/${repo.toLowerCase()}`

  const repository = await db.repository.findUnique({ where: { normalized } })
  if (!repository) notFound()

  // Lazy sync — errors serve stale data
  await syncRepository(repository.id).catch(console.error)

  const fresh = await db.repository.findUniqueOrThrow({ where: { id: repository.id } })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ""

  const lastSynced = fresh.lastSyncedAt
    ? new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
        Math.round((fresh.lastSyncedAt.getTime() - Date.now()) / 60000),
        "minutes",
      )
    : null

  return (
    <>
      <SiteHeader />

      <div className="mx-auto max-w-3xl px-4 pb-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4">
        <Link
          href="/"
          className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Track another repository
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {fresh.ownerAvatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fresh.ownerAvatar}
                  alt={fresh.ownerLogin ?? fresh.owner}
                  className="size-6 rounded-full border border-border"
                />
              )}
              <h1 className="text-xl font-semibold tracking-tight">
                {fresh.owner}/{fresh.name}
              </h1>
            </div>
            {fresh.description && (
              <p className="text-sm text-muted-foreground">{fresh.description}</p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {fresh.githubUrl && (
              <a
                href={fresh.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
              >
                <ExternalLinkIcon className="size-3.5" />
                GitHub
              </a>
            )}
            <form
              action={async () => {
                "use server"
                await manualSync(fresh.id)
              }}
            >
              <Button variant="outline" size="sm" type="submit">
                <RefreshCwIcon className="size-3.5" />
                Sync Now
              </Button>
            </form>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <StarIcon className="size-3.5 fill-[#e3b341] text-[#e3b341]" />
            {fresh.stargazerCount.toLocaleString()} stars
          </span>
          {lastSynced && <span>Last synced {lastSynced}</span>}
        </div>
      </div>

      {/* Chart */}
      <div className="mb-8">
        <div id="chart-card" className="overflow-hidden rounded-xl border border-border bg-white p-4 dark:bg-[#0a0a0a]">
          <StarChart
            snapshots={toSeries(fresh.starHistory).map((s) => ({
              date: s.snapshotDate.toISOString(),
              count: s.starCount,
            }))}
          />
        </div>
        <ChartActions
          owner={fresh.owner}
          repo={fresh.name}
          repoUrl={`${appUrl}/${fresh.owner}/${fresh.name}`}
          stars={fresh.stargazerCount}
        />
      </div>

      {/* Embed + Update Token */}
      <div className="flex flex-col gap-6">
        <EmbedSnippet owner={fresh.owner} repo={fresh.name} appUrl={appUrl} />
        <div className="border-t border-border pt-6">
          <UpdateTokenForm repoId={fresh.id} />
        </div>
      </div>
      </div>
    </>
  )
}

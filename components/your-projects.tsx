"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FolderIcon, XIcon } from "lucide-react"

const STORAGE_KEY = "star-trail:your-projects"

function readSlugs(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : []
  } catch {
    return []
  }
}

function writeSlugs(slugs: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
}

export function addYourProject(owner: string, name: string) {
  if (typeof window === "undefined") return
  const slug = `${owner}/${name}`
  const current = readSlugs().filter((s) => s.toLowerCase() !== slug.toLowerCase())
  writeSlugs([slug, ...current])
}

export function YourProjects() {
  const [slugs, setSlugs] = useState<string[] | null>(null)

  useEffect(() => {
    setSlugs(readSlugs())
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSlugs(readSlugs())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  if (slugs === null) return null

  const remove = (slug: string) => {
    const next = readSlugs().filter((s) => s.toLowerCase() !== slug.toLowerCase())
    writeSlugs(next)
    setSlugs(next)
  }

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <FolderIcon className="size-4 text-muted-foreground" />
        <h2 className="font-semibold tracking-tight">Your projects</h2>
        <span className="text-sm text-muted-foreground">Saved locally on this device</span>
      </div>

      {slugs.length === 0 ? (
        <div className="mx-auto my-8 flex h-[100px] w-[300px] items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/40 bg-transparent px-4 text-center">
          <p className="text-xs text-muted-foreground">
            No repositories yet. Add your first one above.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {slugs.map((slug) => {
            const [owner, name] = slug.split("/")
            if (!owner || !name) return null
            return (
              <div
                key={slug}
                className="group flex items-center justify-between gap-2 rounded-xl border bg-card p-3 shadow-sm transition-colors hover:border-[#e3b341]/50"
              >
                <Link href={`/${owner}/${name}`} className="min-w-0 flex-1 truncate text-sm font-medium">
                  {owner}/{name}
                </Link>
                <button
                  type="button"
                  onClick={() => remove(slug)}
                  aria-label={`Remove ${slug}`}
                  className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

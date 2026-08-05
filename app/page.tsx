import type { Metadata } from "next"
import Link from "next/link"
import { StarIcon } from "lucide-react"

import { Leaderboard } from "@/components/leaderboard"
import { SiteHeader } from "@/components/site-header"
import { RegisterForm } from "@/components/register-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { YourProjects } from "@/components/your-projects"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// lucide-react dropped brand marks; inline the GitHub logo.
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 22.29 24 17.8 24 12.5 24 5.87 18.63.5 12 .5Z" />
    </svg>
  )
}

export const revalidate = 60

export const metadata: Metadata = {
  title: "Star Trail — Track GitHub Stars",
  description: "Track GitHub repository star history with a beautiful chart you can embed anywhere.",
}

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-8 sm:py-12">
        {/* Hero — content left, controls top-right */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-4">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              <StarIcon className="size-3 fill-[#e3b341] text-[#e3b341]" />
              Open source · MIT licensed
            </span>
            <h1
              className="text-2xl leading-tight text-balance sm:text-3xl lg:text-4xl"
              style={{ fontFamily: "'Geist Pixel', var(--font-sans)" }}
            >
              Showcase your GitHub star history
            </h1>
            <p className="max-w-2xl text-sm text-pretty text-muted-foreground sm:text-base">
              Turn your GitHub repo&apos;s star history into a clean chart worth showing off. Add
              your repo and drop it straight into your README, docs, or website.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start lg:self-center">
            <Link
              href="https://github.com/gsvprharsha/star-trail"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            >
              <GithubIcon className="size-4" />
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Form below the hero */}
        <div className="w-full rounded-xl border bg-card p-6 shadow-sm">
          <RegisterForm />
        </div>

        {/* Your projects (localStorage) */}
        <YourProjects />

        {/* Leaderboard */}
        <Leaderboard />
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>Track what the stars say about your repo.</p>
          <Link
            href="https://github.com/gsvprharsha/star-trail"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-medium transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" />
            GitHub
          </Link>
        </div>
      </footer>
    </div>
  )
}

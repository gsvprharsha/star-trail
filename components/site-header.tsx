import Link from "next/link"
import { StarIcon } from "lucide-react"

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

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center gap-4 px-6 py-5">
      <Link href="/" className="flex flex-1 items-center gap-2">
        <StarIcon className="size-5 fill-[#e3b341] text-[#e3b341]" />
        <span
          className="font-semibold tracking-tight"
          style={{ fontFamily: "'Geist Pixel', var(--font-sans)" }}
        >
          Star Trail
        </span>
      </Link>
      <Link
        href="/permissions"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        How to use
      </Link>
      <div className="flex flex-1 justify-end">
        <Link
          href="https://github.com/gsvprharsha/star-trail"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: "sm" }), "gap-2")}
        >
          <GithubIcon className="size-4" />
          Star on GitHub
        </Link>
      </div>
    </header>
  )
}

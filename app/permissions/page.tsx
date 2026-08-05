import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Which token permissions Star Trail needs — Star Trail",
  description:
    "A short guide to the GitHub personal access token permissions Star Trail needs, and why the stargazers endpoint now asks for Contents write access.",
}

export default function PermissionsPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <Link
          href="/"
          className="mb-8 flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back
        </Link>

        <article className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          {/* Title block */}
          <div className="space-y-3 border-b pb-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Guide · 2 min read
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Which token permissions does Star Trail need?
            </h1>
            <p className="text-base">
              Star Trail reads your repository&apos;s stargazer history from GitHub, so it needs a
              token with the right access. This page walks through exactly what to grant — and why
              one of the permissions might surprise you.
            </p>
          </div>

          {/* Intro */}
          <p>
            To pull star data, Star Trail uses a{" "}
            <a
              href="https://github.com/settings/personal-access-tokens/new"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-4"
            >
              fine-grained personal access token
            </a>{" "}
            that you create on GitHub. Fine-grained tokens are scoped to specific repositories and
            specific permissions, so you&apos;re never handing over blanket access to your whole
            account. You stay in control of what the token can touch.
          </p>

          {/* The permissions */}
          <h2 className="pt-2 text-xl font-semibold text-foreground">The permissions to grant</h2>
          <p>
            When you create the token, scroll to{" "}
            <span className="font-medium text-foreground">Permissions → Repository permissions</span>{" "}
            and set these two:
          </p>

          <ul className="flex flex-col gap-3">
            <li className="rounded-lg border bg-card p-4">
              <div className="font-medium text-foreground">
                Metadata → <span className="font-mono text-sm">Read-only</span>
              </div>
              <p className="mt-1 text-sm">
                GitHub requires this on every fine-grained token that touches a repository. It
                covers the basics — the repo&apos;s name, description, and other public details.
              </p>
            </li>
            <li className="rounded-lg border bg-card p-4">
              <div className="font-medium text-foreground">
                Contents → <span className="font-mono text-sm">Read and write</span>
              </div>
              <p className="mt-1 text-sm">
                This is the one that catches people off guard. The stargazers endpoint now requires
                Contents write access — that&apos;s how GitHub verifies you&apos;re a collaborator,
                and read-only is no longer accepted.
              </p>
            </li>
          </ul>

          {/* Why contents write */}
          <h2 className="pt-2 text-xl font-semibold text-foreground">
            Wait — why does reading stars need <span className="italic">write</span> access?
          </h2>
          <p>
            It&apos;s a fair question, and it trips almost everyone up. Reading a star count feels
            like it should only need read access. But GitHub uses the Contents write permission as a
            proxy for &ldquo;this person is actually a collaborator on the repo&rdquo; — it&apos;s a
            gatekeeping check, not something Star Trail uses to change your files.
          </p>
          <p>
            In practice, read-only tokens get rejected by the stargazers endpoint outright, so the
            write permission is the only combination that works today. To be clear:{" "}
            <span className="font-medium text-foreground">
              Star Trail never writes anything to your repository.
            </span>{" "}
            It only reads star data. The write permission is there because GitHub demands it for the
            collaborator check, not because we use it.
          </p>

          {/* Security */}
          <h2 className="pt-2 text-xl font-semibold text-foreground">Where does the token go?</h2>
          <p>
            Once you paste your token, it&apos;s encrypted with AES-256 and stored server-side only.
            It&apos;s never sent back to the browser and never exposed in any embed or chart. If you
            ever want to rotate it, you can update the token from your repository&apos;s page at any
            time.
          </p>
          <p>
            And because you&apos;re using a fine-grained token scoped to a single repository, the
            worst-case blast radius stays tiny — you can revoke it from GitHub whenever you like, and
            Star Trail loses access instantly.
          </p>

          {/* CTA */}
          <div className="mt-8 rounded-lg border bg-card p-5">
            <p className="text-sm">
              Ready to go? Head back, create your token with the two permissions above, and paste it
              in to start tracking your stars.
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-4"
            >
              <ArrowLeftIcon className="size-3.5" />
              Back to Star Trail
            </Link>
          </div>
        </article>
      </main>
    </div>
  )
}

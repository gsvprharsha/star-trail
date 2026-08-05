"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LockIcon, StarIcon } from "lucide-react"

import { registerRepository } from "@/app/actions"
import { Button } from "@/components/ui/button"

type State = Awaited<ReturnType<typeof registerRepository>> | null

export function RegisterForm() {
  const router = useRouter()

  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> =>
      registerRepository(formData.get("repo") as string, formData.get("pat") as string),
    null,
  )

  useEffect(() => {
    if (state?.success) {
      router.push(`/${state.data.owner}/${state.data.name}`)
    }
  }, [state, router])

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="repo" className="text-sm font-medium">
          Repository
        </label>
        <input
          id="repo"
          name="repo"
          type="text"
          required
          placeholder="owner/repo or https://github.com/owner/repo"
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pat" className="text-sm font-medium">
          Personal Access Token
        </label>
        <input
          id="pat"
          name="pat"
          type="password"
          required
          placeholder="github_pat_..."
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        />
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <LockIcon className="size-3 shrink-0" />
          Your token is AES-256 encrypted and stored server-side only. It is never exposed to the
          browser. Requires{" "}
          <code className="font-mono">public_repo</code> scope for public repositories.
        </p>
      </div>

      {state && !state.success && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="gap-2">
        <StarIcon className="size-4" />
        {pending ? "Importing stars…" : "Track Repository"}
      </Button>
    </form>
  )
}

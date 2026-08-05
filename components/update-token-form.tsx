"use client"

import { useActionState } from "react"
import { KeyRoundIcon } from "lucide-react"

import { updateToken } from "@/app/actions"
import { Button } from "@/components/ui/button"

type State = Awaited<ReturnType<typeof updateToken>> | null

export function UpdateTokenForm({ repoId }: { repoId: string }) {
  const [state, action, pending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> =>
      updateToken(repoId, formData.get("pat") as string),
    null,
  )

  return (
    <form action={action} className="flex flex-col gap-3">
      <span className="text-sm font-medium">Update Token</span>
      <div className="flex gap-2">
        <input
          name="pat"
          type="password"
          required
          placeholder="github_pat_..."
          className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        />
        <Button type="submit" variant="outline" size="default" disabled={pending}>
          <KeyRoundIcon className="size-4" />
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
      {state && (
        <p
          className={`text-xs ${state.success ? "text-green-500" : "text-destructive"}`}
        >
          {state.success ? "Token updated successfully." : state.error.message}
        </p>
      )}
    </form>
  )
}

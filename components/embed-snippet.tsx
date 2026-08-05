"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface Props {
  owner: string
  repo: string
  appUrl: string
}

export function EmbedSnippet({ owner, repo, appUrl }: Props) {
  const [copied, setCopied] = useState(false)
  const url = `${appUrl}/api/chart/${owner}/${repo}`
  const pageUrl = `${appUrl}/${owner}/${repo}`
  const markdown = `[![Star Trail](${url})](${pageUrl})`

  async function copy() {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Embed in README</span>
        <Button variant="ghost" size="icon-sm" onClick={copy} aria-label="Copy markdown">
          {copied ? <CheckIcon className="size-3.5 text-green-500" /> : <CopyIcon className="size-3.5" />}
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
        {markdown}
      </pre>
    </div>
  )
}

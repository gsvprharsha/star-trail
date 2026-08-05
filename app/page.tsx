import type { Metadata } from "next"
import { StarIcon } from "lucide-react"

import { RegisterForm } from "@/components/register-form"

export const metadata: Metadata = {
  title: "Star Trail — Track GitHub Stars",
  description: "Track GitHub repository star history with a beautiful chart you can embed anywhere.",
}

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <StarIcon className="size-5 fill-[#e3b341] text-[#e3b341]" />
            <h1 className="text-lg font-semibold tracking-tight">Star Trail</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Track GitHub repository star history. Paste your repo and a Personal Access Token to
            import star data and generate an embeddable chart.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

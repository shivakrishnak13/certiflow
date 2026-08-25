import { CircleAlert } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils/class-names"

type ErrorStateProps = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function ErrorState({
  title,
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-10 text-center",
        className
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <CircleAlert aria-hidden="true" className="size-5" />
      </span>

      <div className="space-y-1">
        <p className="font-medium text-balance">{title}</p>
        {description ? (
          <p className="text-sm text-pretty text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {action}
    </div>
  )
}

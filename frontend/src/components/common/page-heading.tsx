import type { ReactNode } from "react"

import { cn } from "@/lib/utils/class-names"

type PageHeadingProps = {
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}

export function PageHeading({
  title,
  description,
  action,
  className,
}: PageHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-pretty text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

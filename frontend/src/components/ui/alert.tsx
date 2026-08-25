import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleAlert, CircleCheck, Info } from "lucide-react"

import { cn } from "@/lib/utils/class-names"

const alertVariants = cva(
  "flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm",
  {
    variants: {
      variant: {
        destructive: "border-destructive/25 bg-destructive/10 text-destructive",
        success: "border-success/25 bg-success/10 text-success",
        info: "border-border bg-muted text-foreground",
      },
    },
    defaultVariants: {
      variant: "destructive",
    },
  }
)

const alertIcons = {
  destructive: CircleAlert,
  success: CircleCheck,
  info: Info,
}

function Alert({
  className,
  variant = "destructive",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const Icon = alertIcons[variant ?? "destructive"]

  return (
    <div
      data-slot="alert"
      role={variant === "destructive" ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon aria-hidden="true" className="mt-px size-4 shrink-0" />
      <span className="min-w-0 flex-1 break-words">{children}</span>
    </div>
  )
}

export { Alert, alertVariants }

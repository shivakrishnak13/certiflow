import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type LoadingPanelProps = {
  label: string
  rows?: number
}

export function LoadingPanel({ label, rows = 4 }: LoadingPanelProps) {
  return (
    <Card role="status" aria-busy="true" className="w-full">
      <span className="sr-only">{label}</span>

      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>

      <CardContent className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

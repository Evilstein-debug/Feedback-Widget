"use client"

import { cn } from "@/lib/utils"

interface PageLoaderProps {
  message?: string
  className?: string
}

export function PageLoader({ message = "Loading...", className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center gap-6 bg-background",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-medium text-muted-foreground tracking-wide select-none">
          {message}
        </p>
        <LoadingDots />
      </div>
    </div>
  )
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-1", className)} aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: "900ms" }}
        />
      ))}
    </span>
  )
}

export function SkeletonBlock({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800",
        className
      )}
    >
      <span
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-linear-to-r from-transparent via-white/60 dark:via-white/10 to-transparent"
        aria-hidden="true"
      />
    </div>
  )
}

export function ProjectCardsSkeleton() {
  return (
    <div className="grid gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-lg border bg-background shadow-sm p-5 space-y-3 animate-in fade-in"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-5 w-40" />
            <SkeletonBlock className="h-8 w-24 rounded-md" />
          </div>
          <SkeletonBlock className="h-3.5 w-28" />
          <SkeletonBlock className="h-6 w-32 rounded-full" />
          <SkeletonBlock className="h-9 w-full rounded-md mt-1" />
        </div>
      ))}
    </div>
  )
}

export function FeedbackTableSkeleton() {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="flex gap-4 px-4 py-3 border-b bg-muted/30">
        {[80, 60, 200, 80, 80].map((w, i) => (
          <SkeletonBlock key={i} className="h-4 rounded" style={{ width: w }} />
        ))}
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex gap-4 items-center px-4 py-4 border-b last:border-0 animate-in fade-in"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="space-y-1.5" style={{ width: 80 }}>
            <SkeletonBlock className="h-3.5 w-20" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
          <SkeletonBlock className="h-5 w-14 rounded-full" />
          <SkeletonBlock className="h-4 flex-1 rounded" />
          <SkeletonBlock className="h-5 w-16 rounded-full" />
          <SkeletonBlock className="h-3.5 w-16 rounded ml-auto" />
        </div>
      ))}
    </div>
  )
}

"use client";

import { GraduationCap, LoaderCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import { useAuth } from "@/module/auth/hooks/useAuth";

function getInitials(first?: string, last?: string) {
  const initials = `${first?.[0] || ""}${last?.[0] || ""}`.trim();

  return initials ? initials.toUpperCase() : "U";
}

export function AppHeader() {
  const router = useRouter();
  const { useMeQuery, useLogoutMutation } = useAuth();
  const { data: user, isLoading } = useMeQuery;
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.replace(routes.auth.signIn),
    });
  };

  const userName = user ? `${user.name.first} ${user.name.last}`.trim() : null;

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href={routes.dashboard}
          className="flex min-w-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap aria-hidden="true" className="size-4.5" />
          </span>
          <span className="truncate text-base font-semibold tracking-tight">
            CertiFlow
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isLoading ? (
            <Skeleton className="size-8 rounded-full" />
          ) : userName ? (
            <div className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold"
              >
                {getInitials(user?.name.first, user?.name.last)}
              </span>
              <span className="hidden max-w-[10rem] truncate text-sm font-medium md:block">
                {userName}
              </span>
            </div>
          ) : null}

          <Button
            variant="outline"
            size="xl"
            className="px-3"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <LogOut aria-hidden="true" />
            )}
            <span className="sr-only sm:not-sr-only">Log out</span>
          </Button>
        </div>
      </div>

      {logoutMutation.isError ? (
        <div className="mx-auto w-full max-w-6xl px-4 pb-3 sm:px-6 lg:px-8">
          <Alert>Unable to log out. Please try again.</Alert>
        </div>
      ) : null}
    </header>
  );
}

"use client";

import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { routes } from "@/config/routes";
import { useAuth } from "@/module/auth/hooks/useAuth";

type AuthGuardProps = {
  children: ReactNode;
};

const publicRoutes = new Set([routes.auth.signIn, routes.auth.signUp]);

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const requiresAuthentication = !publicRoutes.has(pathname);
  const { useMeQuery } = useAuth({ meEnabled: requiresAuthentication });

  useEffect(() => {
    if (requiresAuthentication && useMeQuery.isError) {
      router.replace(routes.auth.signIn);
    }
  }, [requiresAuthentication, router, useMeQuery.isError]);

  if (requiresAuthentication && (useMeQuery.isPending || useMeQuery.isError)) {
    return (
      <main className="flex min-h-screen items-center justify-center" role="status">
        <LoaderCircle aria-hidden="true" className="size-6 animate-spin" />
        <span className="sr-only">Checking your session...</span>
      </main>
    );
  }

  return children;
}

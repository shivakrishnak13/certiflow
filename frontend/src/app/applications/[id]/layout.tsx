import type { ReactNode } from "react";
import { AppHeader } from "@/components/common/app-header";

export default function ApplicationLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="flex-1 bg-muted/40">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
    </>
  );
}

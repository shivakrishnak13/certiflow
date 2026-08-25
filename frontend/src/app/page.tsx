import { AppHeader } from "@/components/common/app-header";
import { ApplicationsDashboard } from "@/module/dashboard/components/applications-dashboard";

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="flex-1 bg-muted/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <ApplicationsDashboard />
        </div>
      </main>
    </>
  );
}

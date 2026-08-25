import { ApplicationsDashboard } from "@/module/dashboard/components/applications-dashboard";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track the status of your certificate applications.</p>
      </header>
      <ApplicationsDashboard />
    </main>
  );
}

import { ApplicationsDashboard } from "@/module/dashboard/components/applications-dashboard";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <ApplicationsDashboard />
    </main>
  );
}

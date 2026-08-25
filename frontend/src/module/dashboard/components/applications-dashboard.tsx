"use client";

import { AlertCircle, LoaderCircle } from "lucide-react";
import { useSyncExternalStore } from "react";
import { ApplicationCard } from "@/module/dashboard/components/application-card";
import { useApplications } from "@/module/dashboard/hooks/useApplications";

const subscribe = () => () => undefined;

export function ApplicationsDashboard() {
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { data: applications, error, isLoading } = useApplications(hasMounted);

  if (!hasMounted || isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
        <LoaderCircle className="size-4 animate-spin" />
        Loading applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <AlertCircle className="size-5 text-destructive" aria-hidden="true" />
        <p className="font-medium">Unable to load applications</p>
        <p className="text-sm text-muted-foreground">Please refresh the page and try again.</p>
      </div>
    );
  }

  if (!applications?.length) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        You do not have any applications yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {applications.map((application) => (
        <ApplicationCard key={application._id} application={application} />
      ))}
    </div>
  );
}

"use client";

import { isAxiosError } from "axios";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import type { ErrorResponseType } from "@/lib/api";
import { ApplicationCard } from "@/module/dashboard/components/application-card";
import { useApplications } from "@/module/dashboard/hooks/useApplications";
import { useCreateApplication } from "@/module/dashboard/hooks/useCreateApplication";

const subscribe = () => () => undefined;

export function ApplicationsDashboard() {
  const router = useRouter();
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { data: applications, error, isLoading } = useApplications(hasMounted);
  const { useCreateApplicationMutation } = useCreateApplication();
  const createError = isAxiosError<ErrorResponseType>(useCreateApplicationMutation.error)
    ? useCreateApplicationMutation.error.response?.data.message
    : null;

  const handleCreateApplication = () => {
    useCreateApplicationMutation.mutate(undefined, {
      onSuccess: (application) => {
        router.push(routes.applications.details(application._id));
      },
    });
  };

  if (!hasMounted || isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
        <LoaderCircle className="size-4 animate-spin" />
        Loading applications...
      </div>
    );
  }

  const createApplicationAction = (
    <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
      <Button onClick={handleCreateApplication} disabled={useCreateApplicationMutation.isPending}>
        {useCreateApplicationMutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
        Get Provisional Certificate
      </Button>
      {useCreateApplicationMutation.isError && (
        <p className="text-sm text-destructive">
          {createError || "Unable to create an application. Please try again."}
        </p>
      )}
    </div>
  );

  if (error) {
    return (
      <>
        {createApplicationAction}
        <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertCircle className="size-5 text-destructive" aria-hidden="true" />
          <p className="font-medium">Unable to load applications</p>
          <p className="text-sm text-muted-foreground">Please refresh the page and try again.</p>
        </div>
      </>
    );
  }

  if (!applications?.length) {
    return (
      <>
        {createApplicationAction}
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          You do not have any applications yet.
        </div>
      </>
    );
  }

  return (
    <>
      {createApplicationAction}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((application) => (
          <ApplicationCard key={application._id} application={application} />
        ))}
      </div>
    </>
  );
}

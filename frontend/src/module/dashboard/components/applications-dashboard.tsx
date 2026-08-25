"use client";

import { isAxiosError } from "axios";
import { AlertCircle, LoaderCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import type { ErrorResponseType } from "@/lib/api";
import { ApplicationCard } from "@/module/dashboard/components/application-card";
import { useApplications } from "@/module/dashboard/hooks/useApplications";
import { useCreateApplication } from "@/module/dashboard/hooks/useCreateApplication";
import { useAuth } from "@/module/auth/hooks/useAuth";

const subscribe = () => () => undefined;

export function ApplicationsDashboard() {
  const router = useRouter();
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { data: applications, error, isLoading } = useApplications(hasMounted);
  const { useCreateApplicationMutation } = useCreateApplication();
  const { useMeQuery, useLogoutMutation } = useAuth();
  const { data: user } = useMeQuery;
  const logoutMutation = useLogoutMutation();
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

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.replace(routes.auth.signIn),
    });
  };

  const userName = user ? `${user.name.first} ${user.name.last}`.trim() : null;

  const dashboardHeader = (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {userName ? `Welcome back, ${userName}.` : "Track the status of your certificate applications."}
        </p>
      </div>
      <div className="flex flex-col items-start gap-1 sm:items-end">
        <div className="flex items-center gap-3">
          {userName && <span className="text-sm font-medium">{userName}</span>}
          <Button variant="outline" onClick={handleLogout} disabled={logoutMutation.isPending}>
            {logoutMutation.isPending ? <LoaderCircle className="animate-spin" /> : <LogOut />}
            Log out
          </Button>
        </div>
        {logoutMutation.isError && <p className="text-sm text-destructive">Unable to log out. Please try again.</p>}
      </div>
    </header>
  );

  if (!hasMounted || isLoading) {
    return (
      <>
        {dashboardHeader}
        <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
          <LoaderCircle className="size-4 animate-spin" />
          Loading applications...
        </div>
      </>
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
        {dashboardHeader}
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
        {dashboardHeader}
        {createApplicationAction}
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          You do not have any applications yet.
        </div>
      </>
    );
  }

  return (
    <>
      {dashboardHeader}
      {createApplicationAction}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((application) => (
          <ApplicationCard key={application._id} application={application} />
        ))}
      </div>
    </>
  );
}

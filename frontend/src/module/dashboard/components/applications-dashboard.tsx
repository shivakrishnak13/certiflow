"use client";

import { isAxiosError } from "axios";
import { FileText, LoaderCircle, Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { ErrorState } from "@/components/common/error-state";
import { PageHeading } from "@/components/common/page-heading";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import type { ErrorResponseType } from "@/lib/api";
import { ApplicationCard } from "@/module/dashboard/components/application-card";
import { useApplications } from "@/module/dashboard/hooks/useApplications";
import { useCreateApplication } from "@/module/dashboard/hooks/useCreateApplication";
import { useAuth } from "@/module/auth/hooks/useAuth";

const subscribe = () => () => undefined;

function ApplicationCardSkeleton() {
  return (
    <Card aria-hidden="true">
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-3.5 w-2/3" />
      </CardContent>
      <CardContent>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export function ApplicationsDashboard() {
  const router = useRouter();
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { data: applications, error, isLoading, refetch, isFetching } = useApplications(hasMounted);
  const { useCreateApplicationMutation } = useCreateApplication();
  const { useMeQuery } = useAuth();
  const { data: user } = useMeQuery;
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

  const userName = user ? `${user.name.first} ${user.name.last}`.trim() : null;
  const isCreating = useCreateApplicationMutation.isPending;

  const createApplicationButton = (
    <Button
      className="w-full sm:w-auto"
      size="xl"
      onClick={handleCreateApplication}
      disabled={isCreating}
    >
      {isCreating ? (
        <LoaderCircle aria-hidden="true" className="animate-spin" />
      ) : (
        <Plus aria-hidden="true" />
      )}
      {isCreating ? "Creating..." : "Get Provisional Certificate"}
    </Button>
  );

  const isEmpty = hasMounted && !isLoading && !error && !applications?.length;

  const heading = (
    <PageHeading
      title="Applications"
      description={
        userName
          ? `Welcome back, ${userName}. Create and track your provisional certificate applications.`
          : "Create and track your provisional certificate applications."
      }
      action={isEmpty ? undefined : createApplicationButton}
    />
  );

  const renderBody = () => {
    if (!hasMounted || isLoading) {
      return (
        <div
          role="status"
          aria-busy="true"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <span className="sr-only">Loading applications...</span>
          <ApplicationCardSkeleton />
          <ApplicationCardSkeleton />
          <ApplicationCardSkeleton />
        </div>
      );
    }

    if (error) {
      return (
        <ErrorState
          title="Unable to load applications"
          description="Something went wrong while loading your applications. Please try again."
          action={
            <Button variant="outline" size="xl" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? (
                <LoaderCircle aria-hidden="true" className="animate-spin" />
              ) : (
                <RefreshCw aria-hidden="true" />
              )}
              Try again
            </Button>
          }
        />
      );
    }

    if (!applications?.length) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-background px-4 py-12 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FileText aria-hidden="true" className="size-5" />
          </span>
          <div className="space-y-1">
            <p className="font-medium">No applications yet</p>
            <p className="mx-auto max-w-sm text-sm text-pretty text-muted-foreground">
              Start a new application to enter your details, upload your documents,
              and download your provisional certificate.
            </p>
          </div>
          {createApplicationButton}
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
  };

  return (
    <div className="space-y-6">
      {heading}

      {useCreateApplicationMutation.isError && (
        <Alert>{createError || "Unable to create an application. Please try again."}</Alert>
      )}

      {renderBody()}
    </div>
  );
}

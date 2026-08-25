"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { fieldAria, FormField } from "@/components/common/form-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { routes } from "@/config/routes";
import type { ErrorResponseType } from "@/lib/api";
import { useAuth } from "@/module/auth/hooks/useAuth";
import type { AuthFormProps, UserLoginDataType, UserRegisterDataType } from "@/module/auth/types";
import { signInSchema, SignInValues, signUpSchema, SignUpValues } from "@/module/auth/utils/form-utils";
import { PasswordInput } from "@/module/auth/components/password-input";

export function AuthForm({ mode }: AuthFormProps) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();
  const { useLoginMutation, useRegisterMutation } = useAuth();
  const form = useForm<SignUpValues | SignInValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: isSignUp
      ? { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }
      : { email: "", password: "" },
  });

  const onSubmit = (values: SignUpValues | SignInValues) => {
    if (!isSignUp) {
      useLoginMutation.mutate(values as SignInValues satisfies UserLoginDataType, {
        onSuccess: () => router.push(routes.dashboard),
      });
      return;
    }

    const { firstName, lastName, email, password } = values as SignUpValues;
    useRegisterMutation.mutate({
      email,
      password,
      name: { first: firstName, last: lastName },
    } satisfies UserRegisterDataType, {
      onSuccess: () => router.push(routes.dashboard),
    });
  };

  const activeMutation = isSignUp ? useRegisterMutation : useLoginMutation;
  const submitError = isAxiosError<ErrorResponseType>(activeMutation.error)
    ? activeMutation.error.response?.data.message
    : null;
  const errors = form.formState.errors;
  const signUpErrors = errors as FieldErrors<SignUpValues>;
  const title = isSignUp ? "Create your account" : "Welcome back";
  const description = isSignUp
    ? "Start managing your provisional certificates in one place."
    : "Sign in to continue to CertiFlow.";
  const fallbackError = isSignUp
    ? "Unable to create your account. Please try again."
    : "Unable to sign in. Please check your details and try again.";

  return (
    <Card className="w-full [--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)]">
      <CardHeader className="gap-1.5">
        <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          {isSignUp && (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="firstName" label="First name" required error={signUpErrors.firstName?.message}>
                <Input
                  id="firstName"
                  autoComplete="given-name"
                  placeholder="Jane"
                  {...form.register("firstName")}
                  {...fieldAria("firstName", signUpErrors.firstName?.message)}
                />
              </FormField>

              <FormField id="lastName" label="Last name" required error={signUpErrors.lastName?.message}>
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  placeholder="Doe"
                  {...form.register("lastName")}
                  {...fieldAria("lastName", signUpErrors.lastName?.message)}
                />
              </FormField>
            </div>
          )}

          <FormField id="email" label="Email address" required error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...form.register("email")}
              {...fieldAria("email", errors.email?.message)}
            />
          </FormField>

          <FormField
            id="password"
            label="Password"
            required
            error={errors.password?.message}
            hint={isSignUp ? "Use at least 8 characters." : undefined}
          >
            <PasswordInput
              id="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              placeholder="Enter your password"
              {...form.register("password")}
              {...fieldAria("password", errors.password?.message)}
            />
          </FormField>

          {isSignUp && (
            <FormField id="confirmPassword" label="Confirm password" required error={signUpErrors.confirmPassword?.message}>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                {...form.register("confirmPassword")}
                {...fieldAria("confirmPassword", signUpErrors.confirmPassword?.message)}
              />
            </FormField>
          )}

          {activeMutation.isError && <Alert>{submitError || fallbackError}</Alert>}

          <Button className="w-full" size="xl" type="submit" disabled={activeMutation.isPending}>
            {activeMutation.isPending ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
            {activeMutation.isPending
              ? isSignUp
                ? "Creating account..."
                : "Signing in..."
              : isSignUp
                ? "Create account"
                : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            className="rounded font-medium text-foreground underline underline-offset-4 outline-none hover:text-foreground/80 focus-visible:ring-3 focus-visible:ring-ring/50"
            href={isSignUp ? routes.auth.signIn : routes.auth.signUp}
          >
            {isSignUp ? "Sign in" : "Create one"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/config/routes";
import { useAuth } from "@/module/auth/hooks/useAuth";
import type { AuthFormProps, UserLoginDataType, UserRegisterDataType } from "@/module/auth/types";
import { signInSchema, SignInValues, signUpSchema, SignUpValues } from "@/module/auth/utils/form-utils";
import { PasswordInput } from "@/module/auth/components/password-input";

function FieldError({ children }: { children?: string }) {
  return children ? <p className="text-xs text-destructive">{children}</p> : null;
}

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
  const submitError = activeMutation.error instanceof Error ? activeMutation.error.message : null;
  const signUpErrors = form.formState.errors as FieldErrors<SignUpValues>;
  const title = isSignUp ? "Create your account" : "Welcome back";
  const description = isSignUp
    ? "Start managing your certificates in one place."
    : "Sign in to continue to CertiFlow.";

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader className="gap-2">
        <p className="text-sm font-semibold text-primary">CertiFlow</p>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          {isSignUp && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" autoComplete="given-name" placeholder="Jane" {...form.register("firstName")} />
                  <FieldError>{signUpErrors.firstName?.message}</FieldError>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" autoComplete="family-name" placeholder="Doe" {...form.register("lastName")} />
                  <FieldError>{signUpErrors.lastName?.message}</FieldError>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...form.register("email")} />
            <FieldError>{form.formState.errors.email?.message}</FieldError>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput id="password" autoComplete={isSignUp ? "new-password" : "current-password"} placeholder="••••••••" {...form.register("password")} />
            <FieldError>{form.formState.errors.password?.message}</FieldError>
          </div>
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <PasswordInput id="confirmPassword" autoComplete="new-password" placeholder="••••••••" {...form.register("confirmPassword")} />
              <FieldError>{signUpErrors.confirmPassword?.message}</FieldError>
            </div>
          )}
          {submitError && <p className="text-sm text-destructive">Unable to create your account. Please try again.</p>}
          <Button className="h-10 w-full" type="submit" disabled={activeMutation.isPending}>
            {activeMutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
            {isSignUp ? "Create account" : "Sign in"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href={isSignUp ? routes.auth.signIn : routes.auth.signUp}>
            {isSignUp ? "Sign in" : "Create one"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

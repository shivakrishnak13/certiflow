import { Check } from "lucide-react";
import { cn } from "@/lib/utils/class-names";

export type ApplicationStepNumber = 1 | 2 | 3;

type ApplicationStepperProps = {
  currentStep: ApplicationStepNumber;
  className?: string;
};

const steps = [
  { id: 1, label: "Applicant Details" },
  { id: 2, label: "Documents" },
  { id: 3, label: "Review" },
];

export function ApplicationStepper({
  currentStep,
  className,
}: ApplicationStepperProps) {
  const activeStep = steps[currentStep - 1];

  return (
    <nav aria-label="Application progress" className={cn("w-full", className)}>
      <div className="sm:hidden">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Step {currentStep} of {steps.length}
        </p>
        <p className="mt-0.5 text-sm font-semibold">{activeStep.label}</p>
        <ol className="mt-2.5 flex items-center gap-1.5">
          {steps.map((step) => (
            <li
              key={step.id}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                step.id <= currentStep ? "bg-primary" : "bg-border"
              )}
            >
              <span className="sr-only">
                {`${step.id}. ${step.label}`}
                {step.id < currentStep
                  ? " (completed)"
                  : step.id === currentStep
                    ? " (current step)"
                    : " (not started)"}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <ol className="hidden items-center sm:flex">
        {steps.map((step, index) => {
          const isComplete = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <li
              key={step.id}
              className={cn(
                "flex items-center gap-2.5",
                index < steps.length - 1 && "flex-1"
              )}
            >
              <span
                aria-current={isCurrent ? "step" : undefined}
                className="flex items-center gap-2.5"
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    isComplete && "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary bg-primary text-primary-foreground ring-3 ring-primary/20",
                    !isComplete &&
                      !isCurrent &&
                      "border-border bg-background text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <Check aria-hidden="true" className="size-3.5" />
                  ) : (
                    step.id
                  )}
                </span>
                <span
                  className={cn(
                    "text-sm whitespace-nowrap",
                    isCurrent
                      ? "font-semibold text-foreground"
                      : isComplete
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                  )}
                >
                  {step.label}
                  <span className="sr-only">
                    {isComplete
                      ? " (completed)"
                      : isCurrent
                        ? " (current step)"
                        : " (not started)"}
                  </span>
                </span>
              </span>

              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-1 h-px min-w-4 flex-1",
                    isComplete ? "bg-primary" : "bg-border"
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

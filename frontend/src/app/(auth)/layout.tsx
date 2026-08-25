import { Download, FileText, GraduationCap, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

const highlights = [
  {
    icon: FileText,
    title: "Guided application",
    description:
      "Enter your details, upload your documents, and review everything before you submit.",
  },
  {
    icon: ShieldCheck,
    title: "Secure document handling",
    description:
      "Your ID proof and degree certificate are uploaded over a secure, private connection.",
  },
  {
    icon: Download,
    title: "Certificate on submission",
    description:
      "Download your provisional certificate as soon as the application is submitted.",
  },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-1 flex-col lg:flex-row">
      <section className="hidden border-r bg-muted/40 lg:flex lg:w-[46%] lg:max-w-xl lg:flex-col lg:justify-center lg:px-12 lg:py-16 xl:px-16">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap aria-hidden="true" className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">CertiFlow</span>
        </div>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight text-balance xl:text-3xl">
          Provisional certificates, without the paperwork.
        </h2>
        <p className="mt-3 max-w-md text-sm text-pretty text-muted-foreground">
          Apply for your provisional certificate online and track every
          application from a single dashboard.
        </p>

        <ul className="mt-10 space-y-6">
          {highlights.map((highlight) => (
            <li key={highlight.title} className="flex gap-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-foreground">
                <highlight.icon aria-hidden="true" className="size-4.5" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium">{highlight.title}</p>
                <p className="max-w-sm text-sm text-pretty text-muted-foreground">
                  {highlight.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-center gap-2.5 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap aria-hidden="true" className="size-4.5" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              CertiFlow
            </span>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}

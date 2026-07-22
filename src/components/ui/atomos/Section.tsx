import { cn } from "@/utils/cn";
import * as React from "react";

type SectionVariant = "default" | "card" | "borderless" | "highlight";

const variantStyles: Record<SectionVariant, string> = {
  default: "rounded-2xl border border-gray-200 bg-white p-6",
  card: "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm",
  borderless: "p-0",
  highlight:
    "rounded-2xl border border-primary-100/30 bg-primary-100/5 p-6",
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: SectionVariant;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function Section({
  variant = "default",
  title,
  description,
  actions,
  children,
  className,
  ...props
}: SectionProps) {
  return (
    <section className={cn(variantStyles[variant], className)} {...props}>
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-primary-textoTitle text-lg font-semibold">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-primary-texto mt-0.5 text-sm">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

interface SectionGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}

export function SectionGrid({
  cols = 2,
  children,
  className,
  ...props
}: SectionGridProps) {
  const colsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", colsMap[cols], className)} {...props}>
      {children}
    </div>
  );
}

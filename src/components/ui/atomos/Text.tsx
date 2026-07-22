import { cn } from "../../../utils/cn";
import * as React from "react";

type As = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "label" | "small";

type Variant = "title" | "subtitle" | "body" | "caption" | "label" | "error";

const variantStyles: Record<Variant, string> = {
  title: "text-primary-textoTitle font-bold tracking-tight",
  subtitle: "text-primary-textoTitle font-semibold",
  body: "text-primary-texto font-normal",
  caption: "text-primary-texto/70 text-sm font-normal",
  label: "text-primary-texto text-sm font-semibold",
  error: "text-red-500 text-sm font-medium",
};

const asTagMap: Record<As, string> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  span: "span",
  label: "label",
  small: "small",
};

type TextProps = {
  as?: As;
  variant?: Variant;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: string;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
} & React.HTMLAttributes<HTMLElement>;

const sizeMap: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
};

const weightMap: Record<string, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const defaultSizes: Record<As, string> = {
  h1: "4xl",
  h2: "2xl",
  h3: "xl",
  h4: "lg",
  p: "base",
  span: "base",
  label: "sm",
  small: "xs",
};

const defaultWeights: Record<As, string> = {
  h1: "bold",
  h2: "bold",
  h3: "semibold",
  h4: "semibold",
  p: "normal",
  span: "normal",
  label: "semibold",
  small: "normal",
};

const defaultVariants: Record<As, Variant> = {
  h1: "title",
  h2: "title",
  h3: "subtitle",
  h4: "subtitle",
  p: "body",
  span: "body",
  label: "label",
  small: "caption",
};

export function Text({
  as = "p",
  variant,
  size,
  weight,
  color,
  children,
  className,
  htmlFor,
  ...props
}: TextProps) {
  const Tag = asTagMap[as] as keyof JSX.IntrinsicElements;
  const resolvedVariant = variant || defaultVariants[as];
  const resolvedSize = size || defaultSizes[as];
  const resolvedWeight = weight || defaultWeights[as];

  const classes = cn(
    variantStyles[resolvedVariant],
    sizeMap[resolvedSize],
    weightMap[resolvedWeight],
    color,
    className,
  );

  if (as === "label") {
    return (
      <label htmlFor={htmlFor} className={classes} {...props}>
        {children}
      </label>
    );
  }

  return React.createElement(Tag, { className: classes, ...props }, children);
}

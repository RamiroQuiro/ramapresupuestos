import { cn } from "@/utils/cn";
import * as React from "react";

const buttonVariants = {
  variants: {
    variant: {
      primary: "bg-primary-100 text-white hover:bg-primary-100/90 focus:ring-primary-100",
      secondary: "bg-primary-200 text-white hover:bg-primary-200/90 focus:ring-primary-200",
      outline: "border border-gray-300/50 text-white hover:bg-gray-100 focus:ring-gray-400",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
      cancel: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
      success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-600",
      warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500",
      indigo: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500",
      blanco: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 focus:ring-gray-400",
      link: "bg-transparent text-primary-100 underline-offset-2 hover:underline focus:ring-primary-100",
    },
    size: {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-xs",
      lg: "h-12 px-8 text-base",
      xl: "h-14 px-10 text-lg",
      icon: "h-10 w-10",
      "icon-sm": "h-8 w-8",
    },
  },
  defaultVariants: {
    variant: "primary" as const,
    size: "default" as const,
  },
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variants.variant;
  size?: keyof typeof buttonVariants.variants.size;
  loading?: boolean;
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, href, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-sm text-white text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97]";

    const classes = cn(
      base,
      buttonVariants.variants.variant[variant || buttonVariants.defaultVariants.variant],
      buttonVariants.variants.size[size || buttonVariants.defaultVariants.size],
      className,
    );

    if (href) {
      return (
        <a href={href} className={classes}>
          {loading && <Spinner />}
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

function Spinner() {
  return (
    <svg
      className="mr-2 h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export { Button, buttonVariants };
export default Button;

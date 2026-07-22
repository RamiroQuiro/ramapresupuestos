import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-default",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-indigo-600 text-white shadow-sm hover:bg-indigo-700",
        secondary:
          "border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline:
          "text-gray-500 border-gray-200 bg-transparent hover:bg-gray-50 hover:border-gray-300",
        success:
          "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
        warning:
          "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

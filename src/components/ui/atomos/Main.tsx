import * as React from "react";
import { cn } from "../../../utils";

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  padded?: boolean;
  children: React.ReactNode;
}

export function Main({
  padded = true,
  children,
  className,
  ...props
}: MainProps) {
  return (
    <main
      className={cn(
        "flex-1 overflow-y- max-w-4/12 auto m-auto",
        padded && "p-4",
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}

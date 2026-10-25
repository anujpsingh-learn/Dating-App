import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "teal" | "violet" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        {
          "bg-primary/10 text-primary border border-primary/20": variant === "default",
          "bg-secondary/10 text-secondary border border-secondary/20": variant === "secondary",
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20": variant === "teal",
          "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20": variant === "violet",
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20": variant === "warning",
          "border border-border text-foreground": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };

"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ showLabel = false, className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("h-9 w-9 rounded-full bg-muted animate-pulse", className)} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 select-none group",
        isDark
          ? "bg-card/90 border-primary/30 text-primary-foreground shadow-lg shadow-primary/10 hover:border-primary/60"
          : "bg-white/90 border-slate-200 text-slate-800 shadow-md hover:border-primary/40",
        className
      )}
      title={`Currently ${isDark ? "Dark" : "Light"} mode. Click to switch to ${isDark ? "Light" : "Dark"} mode.`}
    >
      <div className="relative flex items-center justify-center w-5 h-5">
        <Sun
          className={cn(
            "w-4 h-4 text-amber-500 transition-all duration-300 absolute",
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          )}
        />
        <Moon
          className={cn(
            "w-4 h-4 text-purple-400 transition-all duration-300 absolute",
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          )}
        />
      </div>

      <span className="text-xs font-bold tracking-tight">
        {isDark ? "Dark" : "Light"}
      </span>

      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

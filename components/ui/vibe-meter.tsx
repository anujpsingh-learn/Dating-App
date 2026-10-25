"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface VibeMeterProps {
  score: number;
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
  className?: string;
  animate?: boolean;
}

export function VibeMeter({
  score,
  size = "default",
  showLabel = true,
  className,
  animate = true,
}: VibeMeterProps) {
  // Ensure score is bounded
  const clampedScore = Math.min(97, Math.max(0, score));

  const getVibeStatus = (val: number) => {
    if (val >= 85) return { label: "High Synergy", color: "text-primary" };
    if (val >= 70) return { label: "Great Vibe", color: "text-secondary" };
    return { label: "Shared Grounds", color: "text-muted-foreground" };
  };

  const status = getVibeStatus(clampedScore);

  const barHeight = {
    sm: "h-2",
    default: "h-2.5",
    lg: "h-3.5",
  }[size];

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Vibe Match</span>
            <span className={cn("text-[11px] font-normal", status.color)}>
              • {status.label}
            </span>
          </div>
          <span className="font-bold text-sm tracking-tight text-primary">
            {clampedScore}%
          </span>
        </div>
      )}

      {/* Progress track */}
      <div
        className={cn(
          "w-full rounded-full bg-muted overflow-hidden relative p-[1px]",
          barHeight
        )}
      >
        <motion.div
          initial={animate ? { width: 0 } : { width: `${clampedScore}%` }}
          animate={{ width: `${clampedScore}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full relative",
            clampedScore >= 80 ? "vibe-gradient" : "bg-gradient-to-r from-teal-500 to-indigo-500"
          )}
        >
          {/* Subtle light shimmer effect on the edge */}
          <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/40 rounded-full blur-[1px]" />
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Star, ThumbsDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InterestChipProps {
  id: string;
  name: string;
  icon?: string;
  category?: string;
  state?: "neutral" | "like" | "dislike";
  isTop?: boolean;
  isShared?: boolean;
  interactive?: boolean;
  onToggleLike?: (id: string) => void;
  onToggleDislike?: (id: string) => void;
  onToggleTop?: (id: string) => void;
  className?: string;
}

export function InterestChip({
  id,
  name,
  icon,
  state = "neutral",
  isTop = false,
  isShared = false,
  interactive = false,
  onToggleLike,
  onToggleDislike,
  onToggleTop,
  className,
}: InterestChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all select-none border",
        // Neutral
        state === "neutral" && !isShared &&
          "bg-card text-foreground border-border/80 hover:border-primary/40 hover:bg-muted/50",
        // Shared like highlight (used in cards)
        isShared &&
          "bg-primary/10 text-primary border-primary/40 font-semibold shadow-sm",
        // Like State
        state === "like" && !isTop &&
          "bg-primary/15 text-primary border-primary font-semibold shadow-sm",
        // Top 3 State
        isTop &&
          "bg-secondary/15 text-secondary-700 dark:text-secondary-300 border-secondary font-bold shadow-sm ring-1 ring-secondary/30",
        // Dislike State
        state === "dislike" &&
          "bg-destructive/10 text-destructive border-destructive/40 line-through opacity-80",
        interactive && "cursor-pointer",
        className
      )}
      onClick={() => {
        if (interactive && onToggleLike) {
          onToggleLike(id);
        }
      }}
    >
      {icon && <span className="text-sm leading-none">{icon}</span>}
      <span className="truncate max-w-[150px]">{name}</span>

      {isTop && (
        <span
          title="Top 3 Interest"
          className="inline-flex items-center text-amber-500 ml-0.5"
          onClick={(e) => {
            if (interactive && onToggleTop) {
              e.stopPropagation();
              onToggleTop(id);
            }
          }}
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
        </span>
      )}

      {state === "like" && !isTop && interactive && onToggleTop && (
        <button
          type="button"
          title="Make one of top 3"
          className="hover:text-amber-500 text-muted-foreground transition-colors p-0.5"
          onClick={(e) => {
            e.stopPropagation();
            onToggleTop(id);
          }}
        >
          <Star className="w-3 h-3" />
        </button>
      )}

      {interactive && onToggleDislike && (
        <button
          type="button"
          title={state === "dislike" ? "Remove dislike" : "Mark as dislike"}
          className={cn(
            "p-0.5 transition-colors rounded-full hover:bg-muted ml-0.5",
            state === "dislike" ? "text-destructive" : "text-muted-foreground hover:text-destructive"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleDislike(id);
          }}
        >
          <ThumbsDown className="w-2.5 h-2.5" />
        </button>
      )}

      {state === "like" && !interactive && !isTop && (
        <Check className="w-3 h-3 text-primary stroke-[2.5]" />
      )}
    </div>
  );
}

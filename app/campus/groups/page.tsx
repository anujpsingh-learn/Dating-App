"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Sparkles, Check, Plus, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCampus } from "@/lib/campus-store";

export default function CampusGroupsPage() {
  const { campusGroups, joinGroup, leaveGroup } = useCampus();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-secondary text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Users className="w-4 h-4" />
            <span>Campus Communities</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground font-display">
            Interest Groups & Guilds
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Join student-led circles for coding sprints, sports clubs, jam sessions, and study squads.
          </p>
        </div>

        <Link href="/campus/events">
          <Button variant="outline" className="text-xs gap-2">
            <span>Explore Campus Events →</span>
          </Button>
        </Link>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campusGroups.map((group) => (
          <Card
            key={group.id}
            className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="teal" className="text-[10px] font-bold">
                  {group.category}
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">
                  {group.member_count} campus members
                </span>
              </div>

              <h3 className="font-extrabold text-lg text-foreground font-display">
                {group.name}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {group.description}
              </p>
            </div>

            <div className="pt-3 border-t border-border/80 flex items-center justify-between gap-3">
              <Link href="/discover">
                <span className="text-xs font-semibold text-primary hover:underline">
                  Find peers in this circle →
                </span>
              </Link>

              {group.is_member ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    leaveGroup(group.id);
                    showToast(`Left ${group.name}`);
                  }}
                  className="gap-1.5 text-xs text-secondary border-secondary/30"
                >
                  <Check className="w-3.5 h-3.5 text-secondary" />
                  <span>Joined</span>
                </Button>
              ) : (
                <Button
                  variant="vibe"
                  size="sm"
                  onClick={() => {
                    joinGroup(group.id);
                    showToast(`You joined ${group.name}!`);
                  }}
                  className="gap-1.5 text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Join Group</span>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

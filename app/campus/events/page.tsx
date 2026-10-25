"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Sparkles, Check, Plus, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCampus } from "@/lib/campus-store";

export default function CampusEventsPage() {
  const { campusEvents, rsvpEvent } = useCampus();
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
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Campus Happenings</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground font-display">
            Campus Events & Activities
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            RSVP for upcoming hackathons, open mics, sports knockouts, and find event buddies so you never go alone.
          </p>
        </div>

        <Link href="/campus/groups">
          <Button variant="outline" className="text-xs gap-2">
            <span>View Campus Groups →</span>
          </Button>
        </Link>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campusEvents.map((event) => (
          <Card
            key={event.id}
            className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="teal" className="text-[10px] font-bold">
                  {event.category}
                </Badge>
                <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{event.rsvp_count} going</span>
                </span>
              </div>

              <h3 className="font-extrabold text-lg text-foreground font-display">
                {event.title}
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {event.description}
              </p>

              <div className="space-y-1.5 pt-2 text-xs text-muted-foreground border-t border-border/60">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/80 flex items-center justify-between gap-3">
              <Link href="/discover">
                <span className="text-xs font-semibold text-primary hover:underline">
                  Find event buddies →
                </span>
              </Link>

              <Button
                variant={event.has_rsvped ? "secondary" : "vibe"}
                size="sm"
                onClick={() => {
                  rsvpEvent(event.id);
                  showToast(
                    event.has_rsvped
                      ? "RSVP cancelled."
                      : "RSVP confirmed! See you there."
                  );
                }}
                className="gap-1.5 text-xs font-bold"
              >
                {event.has_rsvped ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Attending</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>RSVP</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

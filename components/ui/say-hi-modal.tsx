"use client";

import React, { useState } from "react";
import { Send, X, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "./button";
import { CandidateCard } from "@/types/database";
import { useCampus } from "@/lib/campus-store";

interface SayHiModalProps {
  candidate: CandidateCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SayHiModal({
  candidate,
  isOpen,
  onClose,
  onSuccess,
}: SayHiModalProps) {
  const { sendConnectionRequest, sayHiCountToday, maxSayHiPerDay } = useCampus();
  const [message, setMessage] = useState(
    "Hey! Saw that we both enjoy similar campus interests and would love to connect."
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (message.length > 200) {
      setError("Note cannot exceed 200 characters.");
      return;
    }

    setIsSubmitting(true);
    const result = sendConnectionRequest(candidate.profile.id, message);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Could not send connection request.");
    } else {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center font-bold text-lg text-primary">
            {candidate.profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={candidate.profile.avatar_url}
                alt={candidate.profile.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              candidate.profile.full_name.charAt(0)
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">
              Say hi to {candidate.profile.full_name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {candidate.profile.branch} • Year {candidate.profile.year}
            </p>
          </div>
        </div>

        {/* Synergy Reminder */}
        {candidate.shared_likes.length > 0 && (
          <div className="p-3 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-start gap-2.5 text-xs text-foreground">
            <Sparkles className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-secondary">Great icebreaker: </span>
              You both share interests in{" "}
              <span className="font-medium text-foreground">
                {candidate.shared_likes.slice(0, 3).join(", ")}
              </span>
              .
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Personalized Intro Note (Max 200 chars)
            </label>
            <textarea
              rows={3}
              maxLength={200}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 resize-none transition-colors"
              placeholder="Introduce yourself and suggest a study session, hackathon idea, or coffee chat..."
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>
                Daily requests: {sayHiCountToday} / {maxSayHiPerDay} used
              </span>
              <span className={message.length > 180 ? "text-amber-500 font-semibold" : ""}>
                {message.length} / 200
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="vibe"
              isLoading={isSubmitting}
              className="gap-2 px-6"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Request</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

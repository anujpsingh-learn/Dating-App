"use client";

import React, { useState } from "react";
import { ShieldAlert, X, Check, Ban } from "lucide-react";
import { Button } from "./button";
import { Profile } from "@/types/database";
import { useCampus } from "@/lib/campus-store";

interface ReportModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const REPORT_REASONS = [
  "Inappropriate or offensive behavior",
  "Romantic / dating propositions",
  "Harassment or unwanted contact",
  "Fake or impersonated profile",
  "Spam, advertising or commercial promotion",
  "Other campus safety concern",
];

export function ReportModal({
  profile,
  isOpen,
  onClose,
  onSuccess,
}: ReportModalProps) {
  const { reportUser, blockUser } = useCampus();
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !profile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    reportUser(profile.id, selectedReason, details);

    if (alsoBlock) {
      blockUser(profile.id);
    }

    setIsSubmitting(false);
    onSuccess(
      alsoBlock
        ? `Report filed and ${profile.full_name} has been blocked.`
        : "Thank you for helping keep Vibe Check safe. Our moderators will review this report."
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">
              Report & Block {profile.full_name}
            </h3>
            <p className="text-xs text-muted-foreground">
              Your report is strictly confidential and reviewed by campus safety admins.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Reason for report
            </label>
            <div className="space-y-1.5">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                    selectedReason === r
                      ? "border-destructive/60 bg-destructive/5 font-semibold text-foreground"
                      : "border-border hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                    className="sr-only"
                  />
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      selectedReason === r
                        ? "border-destructive bg-destructive text-white"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {selectedReason === r && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Additional Details (Optional)
            </label>
            <textarea
              rows={2}
              maxLength={500}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide any additional context for campus moderation..."
              className="w-full rounded-2xl border border-input bg-background p-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive resize-none"
            />
          </div>

          <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-muted/60 border border-border cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={alsoBlock}
              onChange={(e) => setAlsoBlock(e.target.checked)}
              className="rounded border-input text-destructive focus:ring-destructive"
            />
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Ban className="w-3.5 h-3.5 text-destructive" />
              <span>Also block this student immediately (recommended)</span>
            </div>
          </label>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              isLoading={isSubmitting}
              className="gap-2 px-5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Submit Report</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

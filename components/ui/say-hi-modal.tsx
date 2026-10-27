"use client";

import React, { useState } from "react";
import {
  Send,
  X,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Coffee,
  Code,
  Dumbbell,
  ArrowRight,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { Button } from "./button";
import { CandidateCard } from "@/types/database";
import { useCampus } from "@/lib/campus-store";

interface SayHiModalProps {
  candidate: CandidateCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CAMPUS_VENUES = [
  {
    name: "Central University Library",
    area: "3rd Floor Quiet Study Pods",
    desc: "Open public study tables with high-speed WiFi",
  },
  {
    name: "Campus Student Center (SAC)",
    area: "Ground Floor Atrium",
    desc: "Active open space for hackathon talks & project syncs",
  },
  {
    name: "Nescafe / Main Cafeteria",
    area: "Outdoor Shaded Seating",
    desc: "Relaxed casual spot for tea, coffee, and casual conversations",
  },
  {
    name: "University Sports Arena",
    area: "Badminton / Table Tennis Courts",
    desc: "Open recreational complex for sports & fitness buddies",
  },
];

const OCCASIONS = [
  { id: "study", label: "Study Sprint & Exam Prep", icon: BookOpen },
  { id: "hackathon", label: "Hackathon / Project Teammate", icon: Code },
  { id: "chai", label: "Campus Chai & Conversation", icon: Coffee },
  { id: "sports", label: "Badminton / Gym / Sports", icon: Dumbbell },
];

export function SayHiModal({
  candidate,
  isOpen,
  onClose,
  onSuccess,
}: SayHiModalProps) {
  const { sendConnectionRequest, sayHiCountToday, maxSayHiPerDay } = useCampus();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("study");
  const [selectedVenue, setSelectedVenue] = useState<string>(CAMPUS_VENUES[0].name);
  const [agreedPlatonic, setAgreedPlatonic] = useState<boolean>(true);
  const [message, setMessage] = useState(
    "Hey! Saw our shared interests and would love to connect for a campus study session or project."
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!agreedPlatonic) {
      setError("You must agree to the strictly platonic student conduct charter.");
      return;
    }

    if (message.length > 200) {
      setError("Note cannot exceed 200 characters.");
      return;
    }

    setIsSubmitting(true);
    // Include occasion and venue context in the intro note
    const finalNote = `[${selectedOccasion.toUpperCase()} @ ${selectedVenue}] ${message}`.slice(0, 200);

    const result = sendConnectionRequest(candidate.profile.id, finalNote);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Could not send connection request.");
    } else {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-3xl bg-background border border-border p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Step Indicator Header */}
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 font-semibold">
            <span className="uppercase tracking-wider text-primary">
              Step {step} of 3 • {step === 1 ? "Occasion" : step === 2 ? "Venue" : "Conduct & Note"}
            </span>
            <span className="text-[11px]">
              Daily requests: {sayHiCountToday} / {maxSayHiPerDay}
            </span>
          </div>

          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Recipient Header */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-card border border-border/80">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                candidate.profile.avatar_url ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
              }
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-headline font-bold text-base text-foreground truncate">
                Connect with {candidate.profile.full_name}
              </h3>
              <span className="text-secondary text-xs" title="Verified Student">
                <CheckCircle2 className="w-4 h-4 fill-secondary/20" />
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {candidate.profile.branch} • Year {candidate.profile.year} • {candidate.vibe_score}% Vibe Match
            </p>
          </div>
        </div>

        {/* STEP 1: Occasion & Campus Purpose */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-headline font-bold text-foreground">
                1. What campus activity are you proposing?
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Clear intent sets expectations and makes meeting up natural and effortless.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OCCASIONS.map((occ) => {
                const Icon = occ.icon;
                const isSelected = selectedOccasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setSelectedOccasion(occ.id)}
                    className={`p-3.5 rounded-2xl text-left border-2 transition-all flex items-start gap-3 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-foreground">
                        {occ.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {occ.id === "study" && "Review notes, solve assignments"}
                        {occ.id === "hackathon" && "Build projects & brainstorm"}
                        {occ.id === "chai" && "Casual discussion & campus life"}
                        {occ.id === "sports" && "Fitness partner or game rally"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setStep(2)}
                className="h-11 px-5 rounded-xl bg-primary text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <span>Continue to Venue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Safe Public Campus Venue */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-headline font-bold text-foreground">
                  2. Choose a Safe Public Campus Spot
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">
                  Campus Policy
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                All initial student meetups must be anchored at verified, public campus spaces.
              </p>
            </div>

            <div className="space-y-2.5">
              {CAMPUS_VENUES.map((venue) => {
                const isSelected = selectedVenue === venue.name;
                return (
                  <button
                    key={venue.name}
                    type="button"
                    onClick={() => setSelectedVenue(venue.name)}
                    className={`w-full p-3 rounded-2xl text-left border-2 transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-secondary bg-secondary/10 text-secondary shadow-sm"
                        : "border-border bg-card text-foreground hover:border-secondary/40"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isSelected ? "bg-secondary text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-xs text-foreground truncate">
                          {venue.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {venue.area} • {venue.desc}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="h-11 px-4 rounded-xl text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="h-11 px-5 rounded-xl bg-primary text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <span>Continue to Safety Charter</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Conduct Agreement & Intro Note */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-headline font-bold text-foreground">
                3. Safety Charter &amp; Personalized Intro
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Send a friendly, respectful note. Your phone and email remain private.
              </p>
            </div>

            {/* Platonic Agreement Checkbox */}
            <label className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/25 flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedPlatonic}
                onChange={(e) => setAgreedPlatonic(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-secondary rounded cursor-pointer"
              />
              <div className="text-xs text-foreground min-w-0">
                <span className="font-bold text-secondary block">
                  Strictly Platonic &amp; Public Campus Pledge
                </span>
                <span className="text-muted-foreground text-[11px] leading-relaxed">
                  I agree that this meetup is strictly platonic (academic, project, or campus friendship). Any romantic solicitation or misconduct results in immediate account suspension under the Student Safety Charter.
                </span>
              </div>
            </label>

            {/* Intro Note Textarea */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Personalized Note</span>
                <span>{message.length} / 200</span>
              </div>
              <textarea
                rows={3}
                maxLength={200}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-2xl border border-input bg-card p-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                placeholder="Suggest a specific study topic, hackathon idea, or say hi..."
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="h-11 px-4 rounded-xl text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button
                onClick={() => handleSubmit()}
                disabled={isSubmitting || !agreedPlatonic}
                className="h-11 px-6 rounded-xl bg-primary text-white font-semibold text-xs flex items-center gap-1.5 shadow-md hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Dispatching..." : "Send Request"}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

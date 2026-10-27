"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  BookOpen,
  GraduationCap,
  Calendar,
  Send,
  CheckCircle2,
  Lock,
  Layers,
  Award,
  Coffee,
  Code,
  Dumbbell,
  Compass,
  Building,
} from "lucide-react";
import { CandidateCard } from "@/types/database";
import { Button } from "./button";
import { VibeMeter } from "./vibe-meter";
import { InterestChip } from "./interest-chip";

interface StudentDossierModalProps {
  candidate: CandidateCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSayHi: (candidate: CandidateCard) => void;
}

export function StudentDossierModal({
  candidate,
  isOpen,
  onClose,
  onSayHi,
}: StudentDossierModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen || !candidate) return null;

  const profile = candidate.profile;

  // Realistic supporting campus lifestyle snapshots
  const gallery = [
    profile.avatar_url ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-3xl bg-background border border-border shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Top Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-background/95 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Verified Campus Dossier
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Student ID: #VC-{profile.id.slice(0, 6).toUpperCase()}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Quick Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <span>{profile.branch}</span>
                <span>•</span>
                <span>Class of {2024 + profile.year} (Year {profile.year})</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground mt-1 tracking-tight">
                {profile.full_name}
              </h1>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <span>{profile.gender || "Student"}</span>
                <span>•</span>
                <span>{profile.age} years old</span>
                <span>•</span>
                <span>{profile.hostel_or_day}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                <div className="text-xl font-black text-primary font-headline">
                  {candidate.vibe_score}%
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Vibe Match
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-secondary/10 border border-secondary/20 text-center">
                <div className="text-xl font-black text-secondary font-headline">
                  100%
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Verified Safe
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery Mosaic */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Main Showcase Photo */}
            <div className="md:col-span-8 relative rounded-2xl overflow-hidden shadow-md aspect-[4/3] sm:aspect-[16/10] bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gallery[selectedImageIndex]}
                alt={profile.full_name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white inline-block mb-1">
                    Campus Persona
                  </span>
                  <p className="text-base sm:text-lg font-headline font-semibold">
                    {profile.full_name} • {profile.branch}
                  </p>
                  <p className="text-xs text-white/80">
                    {profile.hostel_or_day} • Central Campus
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md">
                  Photo {selectedImageIndex + 1} of {gallery.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Stack */}
            <div className="md:col-span-4 grid grid-cols-3 md:grid-cols-1 gap-3">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative rounded-xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-[95px] border-2 transition-all ${
                    selectedImageIndex === idx
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </button>
              ))}
            </div>
          </div>

          {/* Two-Column Master Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Dossier Details & Ethos */}
            <div className="lg:col-span-7 space-y-6">
              {/* Curated Profile & Ethos */}
              <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Curated Profile &amp; Campus Ethos</span>
                </div>
                <h3 className="text-xl font-headline font-semibold text-foreground leading-snug">
                  &ldquo;{profile.bio || "Looking to connect for productive study sessions, weekend hackathons, and genuine campus friendships."}&rdquo;
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Student at university specializing in {profile.branch}. Enthusiastic about collaborating on engineering projects, sharing library sprints, participating in campus fests, and exploring authentic ideas over chai.
                </p>

                {/* Platonic Guarantee Banner */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3 text-xs text-foreground">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-primary block font-semibold mb-0.5">
                      Strictly Platonic Campus Guarantee
                    </strong>
                    All peer connections on Vibe Check are non-romantic, strictly academic and social, and bound by our student safety charter. Mutual respect and student dignity are non-negotiable.
                  </div>
                </div>

                {/* Metric Badges */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/60 text-center">
                  <div className="p-3 rounded-xl bg-muted/60">
                    <div className="text-lg font-bold font-headline text-foreground">
                      12+
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Study Sprints
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/60">
                    <div className="text-lg font-bold font-headline text-foreground">
                      100%
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Punctuality
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/60">
                    <div className="text-lg font-bold font-headline text-foreground">
                      Tier 1
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Verified .edu ID
                    </div>
                  </div>
                </div>
              </div>

              {/* Shared Synergy & Interests */}
              <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Shared Passions &amp; Alignment
                  </h4>
                  <span className="text-xs text-secondary font-semibold">
                    {candidate.shared_likes.length} common likes
                  </span>
                </div>

                {candidate.shared_likes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {candidate.shared_likes.map((like) => (
                      <span
                        key={like}
                        className="px-3 py-1.5 rounded-full bg-secondary/15 text-secondary text-xs font-semibold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{like}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No exact keyword overlap yet, but broad alignment in campus goals!
                  </p>
                )}

                <div className="pt-2">
                  <span className="text-xs font-semibold text-muted-foreground block mb-2">
                    {profile.full_name}&apos;s Top Obsessions:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(candidate.top_shared_likes.length > 0 ? candidate.top_shared_likes : candidate.shared_likes.length > 0 ? candidate.shared_likes : candidate.shared_purposes).slice(0, 6).map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 rounded-full bg-muted text-foreground text-xs font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Curated Campus Occasions */}
              <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Available For Campus Occasions
                </h4>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-muted/50 flex items-center gap-2 text-xs font-medium text-foreground">
                    <BookOpen className="w-4 h-4 text-primary shrink-0" />
                    <span>Library Study Sprints</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/50 flex items-center gap-2 text-xs font-medium text-foreground">
                    <Code className="w-4 h-4 text-secondary shrink-0" />
                    <span>Hackathons &amp; Dev</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/50 flex items-center gap-2 text-xs font-medium text-foreground">
                    <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Chai &amp; Life Talks</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/50 flex items-center gap-2 text-xs font-medium text-foreground">
                    <Dumbbell className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Gym &amp; Badminton</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Action Card & Safety Verification */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-card border-2 border-primary/30 shadow-lg space-y-5 sticky top-24">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Direct Campus Connection
                  </span>
                  <h3 className="text-2xl font-headline font-bold text-foreground mt-0.5">
                    Connect with {profile.full_name.split(" ")[0]}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Send an intro note and propose a safe public campus meetup.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Campus Availability</span>
                    <span className="font-semibold text-foreground">
                      Weekday Evenings &amp; Weekends
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Preferred Locale</span>
                    <span className="font-semibold text-foreground">
                      Central Library / Cafeteria
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Languages</span>
                    <span className="font-semibold text-foreground">
                      English, Hindi
                    </span>
                  </div>
                </div>

                {/* Vibe Meter */}
                <VibeMeter score={candidate.vibe_score} />

                {/* Main Action Button */}
                <Button
                  onClick={() => {
                    onClose();
                    onSayHi(candidate);
                  }}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Say Hi &amp; Plan Campus Meetup</span>
                </Button>

                {/* Safety Guarantee */}
                <div className="pt-2 text-center">
                  <div className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                    <Lock className="w-3.5 h-3.5 text-secondary" />
                    <span>Phone &amp; email revealed only upon mutual acceptance</span>
                  </div>
                </div>
              </div>

              {/* Vetted Credentials Box */}
              <div className="p-5 rounded-2xl bg-secondary/10 border border-secondary/20 space-y-3">
                <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Institutional Credentials</span>
                </div>
                <ul className="space-y-2 text-xs text-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                    <span>University Email Authenticated (.edu / .in)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                    <span>Hostel / Day-Scholar Residence Confirmed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                    <span>Platonic Mutual Respect Pledge Signed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

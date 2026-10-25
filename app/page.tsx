"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  Compass,
  CheckCircle2,
  Lock,
  MessageSquare,
  Building,
  GraduationCap,
  HelpCircle,
  HeartOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VibeMeter } from "@/components/ui/vibe-meter";
import { InterestChip } from "@/components/ui/interest-chip";
import { getAllowedDomains } from "@/lib/domain-validator";

const DEMO_CHIPS = [
  { id: "tech_ai", name: "AI & Machine Learning", icon: "🤖" },
  { id: "sports_badminton", name: "Badminton", icon: "🏸" },
  { id: "music_indie", name: "Indie Rock", icon: "🎸" },
  { id: "tech_hackathons", name: "Hackathons", icon: "🏆" },
  { id: "food_chai", name: "Chai & Deep Talks", icon: "🍵" },
  { id: "art_uiux", name: "UI/UX & Figma", icon: "🎨" },
  { id: "gaming_valorant", name: "Valorant", icon: "🎯" },
  { id: "books_scifi_fantasy", name: "Sci-Fi Novels", icon: "🐉" },
];

export default function LandingPage() {
  const allowed = getAllowedDomains();

  // Interactive Live Hero Demo state
  const [selectedChips, setSelectedChips] = useState<string[]>([
    "tech_ai",
    "sports_badminton",
    "food_chai",
  ]);

  const toggleDemoChip = (id: string) => {
    if (selectedChips.includes(id)) {
      if (selectedChips.length > 1) {
        setSelectedChips(selectedChips.filter((c) => c !== id));
      }
    } else {
      setSelectedChips([...selectedChips, id]);
    }
  };

  // Dynamic vibe score calculation for demo
  const demoScore = Math.min(97, 48 + selectedChips.length * 12);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is Vibe Check a dating app?",
      a: "No, absolutely not. Vibe Check is built specifically to find campus friends, study partners for tough exams, hackathon and capstone project teammates, gym or badminton buddies, and event companions. There are no swipe cards, no hearts, and romantic propositions violate our community code of conduct.",
    },
    {
      q: "Who is allowed to join?",
      a: `Only students with verified institutional university emails (${allowed.map((d) => "@" + d).join(", ")}) can register. Every login requires a one-time code (OTP) sent directly to your student inbox.`,
    },
    {
      q: "Are my phone number and email publicly visible?",
      a: "Never. Your contact details are strictly hidden from public profiles, discover grids, and search results. Only after BOTH you and a peer mutually accept a connection request can contact details be revealed, and only if you explicitly permit it in your privacy settings.",
    },
    {
      q: "How does the Vibe Match algorithm work?",
      a: "The algorithm calculates compatibility based on shared interests, double-weighting your top 3 passions, adding synergy for common goals (like study partner or project teammate), matching course or year bonuses, and subtracting penalties if a candidate's likes conflict with your declared dislikes.",
    },
    {
      q: "How is my data protected under DPDP Act 2023?",
      a: "We practice strict data minimization: we collect only what is necessary to connect you with campus peers. You have complete control to export all your personal data in one click or permanently delete your entire account and records anytime from your settings.",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* 1. HERO SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Pitch */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Campus Peer Network • Not a Dating App</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground font-display leading-[1.08]">
              Find your people. <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Connect on real vibes.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Connect with university students for hackathons, study sprints, sports, campus fests, and genuine lifelong friendships. No swipe cards, no awkward pretenses.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center lg:justify-start">
              <Link href="/discover" className="w-full sm:w-auto">
                <Button size="lg" variant="vibe" className="w-full sm:w-auto gap-2 text-base">
                  <Compass className="w-4 h-4" />
                  <span>Discover Campus Peers</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  <GraduationCap className="w-4 h-4 text-secondary" />
                  <span>Join with University Email</span>
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 justify-center lg:justify-start text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span>Verified .edu Emails</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-primary" />
                <span>Zero Contact Leakage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartOff className="w-4 h-4 text-muted-foreground" />
                <span>Purely Academic & Social</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Hero Chip Demo */}
          <div className="lg:col-span-5">
            <Card className="p-6 rounded-3xl border border-primary/20 bg-card/90 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-36 h-36 bg-primary/10 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-secondary/10 rounded-full blur-3xl -z-10" />

              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
                    🎯
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">
                      Live Vibe Simulator
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Click chips to test matching synergy
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">
                  Interactive
                </span>
              </div>

              {/* Dynamic Vibe Meter */}
              <div className="p-4 rounded-2xl bg-background border border-border/80 space-y-2">
                <VibeMeter score={demoScore} size="lg" />
                <p className="text-[11px] text-muted-foreground text-center">
                  {selectedChips.length} shared campus passions selected
                </p>
              </div>

              {/* Interactive Chips Selector */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tap to toggle interests:
                </div>
                <div className="flex flex-wrap gap-2">
                  {DEMO_CHIPS.map((chip) => {
                    const isSelected = selectedChips.includes(chip.id);
                    return (
                      <InterestChip
                        key={chip.id}
                        id={chip.id}
                        name={chip.name}
                        icon={chip.icon}
                        state={isSelected ? "like" : "neutral"}
                        isTop={chip.id === selectedChips[0]}
                        interactive={true}
                        onToggleLike={toggleDemoChip}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Simulating compatibility with <strong className="text-foreground">Aarav (CSE)</strong>
                </span>
                <Link href="/discover">
                  <span className="text-primary font-semibold hover:underline cursor-pointer">
                    View Peers →
                  </span>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="w-full bg-muted/40 py-16 md:py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              Simple & Authentic
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground font-display">
              How Vibe Check works
            </h3>
            <p className="text-sm text-muted-foreground">
              Designed around respect, shared context, and zero awkward encounters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 rounded-3xl bg-card border-border space-y-4 hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-2xl vibe-gradient flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">
                1
              </div>
              <h4 className="font-bold text-lg text-foreground">
                Define your vibe
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pick your likes, dislikes, and top 3 passions from 100+ campus interests. Select your goals: study buddy, hackathon teammate, or gym partner.
              </p>
            </Card>

            <Card className="p-6 rounded-3xl bg-card border-border space-y-4 hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center font-bold text-lg shadow-md shadow-secondary/20">
                2
              </div>
              <h4 className="font-bold text-lg text-foreground">
                Discover matching peers
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Browse our non-swipe card grid. The Vibe Meter calculates compatibility based on shared goals, overlapping passions, and academic synergy.
              </p>
            </Card>

            <Card className="p-6 rounded-3xl bg-card border-border space-y-4 hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-md shadow-primary/20">
                3
              </div>
              <h4 className="font-bold text-lg text-foreground">
                Say hi & safely connect
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Send an intro note. Once both students mutually accept, verified emails and phone numbers are safely revealed according to your privacy settings.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. SAFETY & DPDP PRIVACY SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="rounded-3xl vibe-gradient-subtle border border-primary/20 p-8 sm:p-12 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Student Privacy & Safety First</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
                Engineered with India’s DPDP Act 2023 in mind.
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We believe campus networking should be dignified and secure. You have full transparency over every piece of data.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">No Public Contact Leakage</strong>
                    <span className="text-muted-foreground">
                      Phone & email are hidden behind mutual 2-way approval.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Daily Request Rate Limits</strong>
                    <span className="text-muted-foreground">
                      Maximum 20 requests per day to prevent spam and harassment.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Universal Block & Report</strong>
                    <span className="text-muted-foreground">
                      Blocked users vanish permanently from each other&apos;s discover lists.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">One-Click Account Deletion</strong>
                    <span className="text-muted-foreground">
                      Erase all profile records and personal data instantly anytime.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center items-center sm:items-start p-6 rounded-2xl bg-card border border-border">
              <Building className="w-8 h-8 text-primary" />
              <div className="font-bold text-sm text-foreground">
                Allowed University Domains
              </div>
              <p className="text-xs text-muted-foreground">
                Currently accepting students from accredited institutional partners:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {allowed.map((d) => (
                  <span
                    key={d}
                    className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-mono text-xs font-semibold"
                  >
                    @{d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
            Got Questions?
          </h2>
          <h3 className="text-3xl font-extrabold text-foreground font-display">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <Card
                key={index}
                className="rounded-2xl border-border bg-card overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-foreground hover:bg-muted/40 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <span className="text-muted-foreground text-xs font-bold">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

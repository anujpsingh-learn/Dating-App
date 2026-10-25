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
  HeartOff,
  Flame,
  Star,
  MapPin,
  GraduationCap,
  MessageSquare,
  HelpCircle,
  Coffee,
  Code,
  Trophy,
  Activity,
  HeartHandshake,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VibeMeter } from "@/components/ui/vibe-meter";
import { InterestChip } from "@/components/ui/interest-chip";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getAllowedDomains } from "@/lib/domain-validator";
import { SEED_STUDENTS } from "@/lib/seed-data";

// Interactive Live Chips for Hero
const HERO_INTEREST_CHIPS = [
  { id: "tech_ai", name: "AI & Machine Learning", icon: "🤖" },
  { id: "tech_hackathons", name: "Hackathons & Dev", icon: "🏆" },
  { id: "sports_badminton", name: "Badminton", icon: "🏸" },
  { id: "music_indie", name: "Indie Rock", icon: "🎸" },
  { id: "food_chai", name: "Chai & Deep Talks", icon: "🍵" },
  { id: "art_uiux", name: "UI/UX & Figma", icon: "🎨" },
  { id: "gaming_valorant", name: "Valorant", icon: "🎯" },
  { id: "books_scifi_fantasy", name: "Sci-Fi Novels", icon: "🐉" },
];

// Live Campus Activity Ticker Items
const LIVE_TICKER = [
  { studentA: "Priya (B.Des '26)", studentB: "Aarav (CSE '25)", activity: "teamed up for Smart India Hackathon", icon: "💻", time: "2m ago" },
  { studentA: "Rohan (ECE)", studentB: "Kabir (MBA)", activity: "matched for evening badminton doubles", icon: "🏸", time: "4m ago" },
  { studentA: "Sneha (Cybersec)", studentB: "Meera (Biotech)", activity: "formed a central library study squad", icon: "📚", time: "8m ago" },
  { studentA: "Tanmay (CSE)", studentB: "Diya (Mass Comm)", activity: "connected to shoot college fest trailer", icon: "📸", time: "11m ago" },
  { studentA: "Vikram (Mech)", studentB: "Ananya (Design)", activity: "paired up for robotics prototype CAD", icon: "⚙️", time: "15m ago" },
];

// 4 Campus Tribes (Visual Photo Cards)
const CAMPUS_TRIBES = [
  {
    title: "Hackathon & Tech Hustlers",
    subtitle: "2 AM pizza, git conflicts & winning SIH",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=700",
    badges: ["Full-Stack", "AI / ML", "LeetCode DSA", "Open Source"],
    popularPurpose: "Project Teammates",
    stat: "140+ projects built this semester",
    color: "from-violet-600/90 to-indigo-900/90",
  },
  {
    title: "Turf & Court Regulars",
    subtitle: "Evening doubles, gym sets & campus sports",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=700",
    badges: ["Badminton", "Gym / Calisthenics", "Football", "Cricket"],
    popularPurpose: "Sports & Hobbies",
    stat: "380+ sports matches scheduled",
    color: "from-teal-600/90 to-emerald-900/90",
  },
  {
    title: "Library & Exam Grind Squad",
    subtitle: "Quiet study sprints, notes exchange & GATE prep",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=700",
    badges: ["Library Sprints", "GATE Prep", "Semester Finals", "Notes Sharing"],
    popularPurpose: "Study Partners",
    stat: "520+ study sessions formed",
    color: "from-amber-600/90 to-orange-900/90",
  },
  {
    title: "Sunset Chai & Indie Circle",
    subtitle: "Acoustic jams on lawn, cafe hops & fest crews",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=700",
    badges: ["Chai & Talks", "Indie Music", "Photography", "Campus Fest"],
    popularPurpose: "Friends & Event Buddies",
    stat: "890+ friendships sparked",
    color: "from-pink-600/90 to-purple-900/90",
  },
];

// Student Testimonials with Real Faces
const TESTIMONIALS = [
  {
    name: "Tanmay Joshi",
    branch: "B.Tech CSE (3rd Year)",
    university: "LPU Campus",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300",
    quote:
      "I spent my first semester eating alone in the hostel mess. Within 3 days of joining Vibe Check, I found my evening badminton partner and two guys to prep for AWS cloud certs with. It genuinely made campus feel like home.",
    vibeMatch: "94% with Aarav",
    purpose: "Study & Sports",
  },
  {
    name: "Ananya Iyer",
    branch: "Bachelor of Design (4th Year)",
    university: "Design Block B",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    quote:
      "Every other app feels like a creepy dating service. Vibe Check is 100% focused on mutual respect. I needed a frontend engineer to code my Figma portfolio case study — matched with a CSE senior and we shipped it in two weeks!",
    vibeMatch: "91% with Sneha",
    purpose: "Project Collaboration",
  },
  {
    name: "Kabir Singh",
    branch: "MBA Integrated (4th Year)",
    university: "School of Business",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    quote:
      "Found our 4-person Smart India Hackathon squad right here. No awkward networking mixers, no spam. Just matching on real interests, shared hustle, and zero fluff.",
    vibeMatch: "88% with Tanmay",
    purpose: "Hackathon Squad",
  },
];

export default function LandingPage() {
  const allowed = getAllowedDomains();

  // Interactive Live Hero Chip Demo State
  const [selectedChips, setSelectedChips] = useState<string[]>([
    "tech_ai",
    "sports_badminton",
    "food_chai",
    "tech_hackathons",
  ]);

  const toggleHeroChip = (id: string) => {
    if (selectedChips.includes(id)) {
      if (selectedChips.length > 1) {
        setSelectedChips(selectedChips.filter((c) => c !== id));
      }
    } else {
      setSelectedChips([...selectedChips, id]);
    }
  };

  // Dynamic Vibe calculation for hero
  const demoScore = Math.min(97, 45 + selectedChips.length * 11);

  // Quick Vibe Finder Interactive Tool State
  const [finderBranch, setFinderBranch] = useState("CSE & Tech");
  const [finderVibe, setFinderVibe] = useState("Hackathon & Dev");

  // Filter realistic student matches based on quick finder
  const matchingStudents = SEED_STUDENTS.slice(0, 3);

  // FAQ State
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Why is Vibe Check strictly NOT a dating app?",
      a: "University students already have too many awkward dating apps filled with superficial swipes, romance pressure, and spam. Vibe Check was created because making authentic campus friends, finding project teammates, study buddies, and badminton partners is actually hard. There are no swipe cards, no hearts, and romantic solicitation directly violates our community guidelines.",
    },
    {
      q: "How does the matching algorithm determine compatibility?",
      a: "The matching engine calculates compatibility based on shared interests (+10 pts each), double-weighting your Top 3 passions (+20 pts each), adding bonuses for shared goals (+8 pts) and same branch or academic year (+6 pts), while subtracting penalties if your candidate's likes conflict with your declared dislikes. The score is normalized between 20% and strictly capped at 97% for real-world authenticity.",
    },
    {
      q: "Who can see my phone number and email?",
      a: "Nobody on public grids. Your phone number and email address are never exposed in search or recommendations. They remain strictly encrypted and are revealed ONLY after BOTH you and another student mutually accept a connection request, and only if you explicitly choose to share them in your privacy controls.",
    },
    {
      q: "Which university domains are eligible to join?",
      a: `Registration is strictly restricted to verified student emails from accredited universities: ${allowed.map((d) => "@" + d).join(", ")}. Every login uses a one-time passcode (OTP) delivered to your student inbox to prevent outsiders or fake profiles.`,
    },
    {
      q: "How does Vibe Check comply with India's DPDP Act 2023?",
      a: "We practice radical data minimization. We do not sell data, track you across the web, or serve commercial ads. You have statutory rights to download all your personal data in one click as a JSON file or permanently delete your entire account and all associated records anytime in Settings.",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full overflow-hidden bg-mesh-pattern">
      {/* 1. TOP LIVE CAMPUS TICKER */}
      <div className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-teal-600 text-white py-2 overflow-hidden border-b border-white/10 shadow-sm">
        <div className="animate-marquee flex items-center gap-10 text-xs font-semibold whitespace-nowrap">
          {LIVE_TICKER.concat(LIVE_TICKER).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="p-1 rounded-full bg-white/20 text-[10px]">{item.icon}</span>
              <span className="font-bold text-teal-200">{item.studentA}</span>
              <span className="text-white/80">& {item.studentB}</span>
              <span className="text-white/95 font-medium">{item.activity}</span>
              <span className="text-white/50 text-[10px]">({item.time})</span>
              <span className="text-white/30 ml-4">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. HIGH-ENERGY HERO SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Bold Copy & Real Student Proof */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Campus Tag Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-bold text-foreground shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-primary font-extrabold font-display">Campus Peer Network</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-teal-600 dark:text-teal-400 font-semibold">100% Not a Dating App</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground font-display leading-[1.06]">
              Find your people. <br />
              <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-teal-500 bg-clip-text text-transparent">
                Connect on real campus vibes.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              No awkward swipes, no romance pressure. Connect with university classmates for late-night hackathons, evening badminton doubles, library study sprints, and genuine college friends.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 justify-center lg:justify-start">
              <Link href="/discover" className="w-full sm:w-auto">
                <Button size="lg" variant="vibe" className="w-full sm:w-auto gap-2.5 text-base font-bold h-13 px-8 shadow-xl shadow-primary/25">
                  <Compass className="w-5 h-5" />
                  <span>Discover Campus Peers</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </Button>
              </Link>
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2.5 text-sm h-13 px-6 glass-panel font-semibold">
                  <GraduationCap className="w-5 h-5 text-secondary" />
                  <span>Sign In with University Email</span>
                </Button>
              </Link>
            </div>

            {/* Social Proof + Student Faces */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start text-xs text-muted-foreground">
              <div className="flex items-center -space-x-2.5">
                {SEED_STUDENTS.slice(0, 5).map((seed, i) => (
                  <div
                    key={seed.profile.id}
                    className="w-10 h-10 rounded-full border-2 border-background overflow-hidden shadow-sm"
                    title={seed.profile.full_name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={seed.profile.avatar_url || ""}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-background bg-violet-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-sm">
                  +2.4k
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="font-bold text-foreground flex items-center gap-1 justify-center sm:justify-start">
                  <span className="text-amber-400">★★★★★</span>
                  <span>Active on University Campuses</span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Verified students from LPU, Thapar, IIT Delhi & partner colleges
                </div>
              </div>
            </div>

            {/* Safety Guarantee Tags */}
            <div className="flex flex-wrap items-center gap-4 pt-2 justify-center lg:justify-start text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified .edu Emails Only</span>
              </div>
              <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400">
                <Lock className="w-4 h-4" />
                <span>Zero Contact Leakage</span>
              </div>
              <div className="flex items-center gap-1.5 text-foreground">
                <HeartOff className="w-4 h-4 text-muted-foreground" />
                <span>Strictly Academic & Social</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Vibe Card with Real Student Reactions */}
          <div className="lg:col-span-5 relative">
            {/* Floating Student Badges */}
            <div className="absolute -top-4 -left-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel text-xs font-bold text-foreground shadow-lg animate-float">
              <span className="text-base">🏸</span>
              <div>
                <span className="block text-[11px] text-muted-foreground font-normal">Rohan (ECE)</span>
                <span>Badminton Court 2 @ 6 PM</span>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-3 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel text-xs font-bold text-foreground shadow-lg animate-float-reverse">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
              <div>
                <span className="block text-[11px] text-teal-600 dark:text-teal-400 font-bold">96% High Synergy</span>
                <span>SIH Hackathon Squad Match</span>
              </div>
            </div>

            {/* Main Interactive Card */}
            <Card className="p-6 sm:p-7 rounded-3xl border border-primary/30 glass-panel shadow-2xl space-y-6 relative overflow-hidden">
              {/* Card Header with Real Student Avatar */}
              <div className="flex items-center justify-between pb-4 border-b border-border/80">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                        alt="Ananya"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-teal-500 border-2 border-card" title="Active on Campus" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-base text-foreground font-display">
                        Ananya Iyer
                      </h3>
                      <Badge variant="teal" className="text-[10px] py-0 px-1.5 font-bold">
                        B.Des &apos;26
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      UI/UX Designer • Looking for Dev Partner
                    </p>
                  </div>
                </div>

                <Badge variant="violet" className="text-[10px] font-bold">
                  Live Simulator
                </Badge>
              </div>

              {/* Dynamic Vibe Meter */}
              <div className="p-4 rounded-2xl bg-card/80 border border-border/80 space-y-2">
                <VibeMeter score={demoScore} size="lg" />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>Based on {selectedChips.length} matching college passions</span>
                  <span className="text-primary font-bold">High Resonance</span>
                </div>
              </div>

              {/* Interactive Chips Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-secondary" />
                    <span>Tap your interests to test synergy:</span>
                  </label>
                  <span className="text-[10px] font-bold text-secondary">
                    {selectedChips.length} active
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {HERO_INTEREST_CHIPS.map((chip) => {
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
                        onToggleLike={toggleHeroChip}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Quick Action Preview */}
              <div className="pt-3 border-t border-border/80 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Simulating match with <strong>Ananya</strong>
                </span>
                <Link href="/discover">
                  <Button size="sm" variant="vibe" className="gap-1.5 font-bold text-xs shadow-md">
                    <Send className="w-3 h-3" />
                    <span>Say Hi to Peers</span>
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. CAMPUS TRIBES - PHOTO LIFESTYLE CARDS */}
      <section className="w-full py-16 md:py-24 border-y border-border/80 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="violet" className="text-xs font-bold uppercase tracking-widest px-3 py-1">
              Find Your Campus Tribe
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground font-display">
              Whatever you&apos;re into, your crew is here.
            </h2>
            <p className="text-sm text-muted-foreground">
              From competitive coding squads to sunset chai jamming, discover students who share your exact frequency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAMPUS_TRIBES.map((tribe, i) => (
              <div
                key={tribe.title}
                className="group relative rounded-3xl overflow-hidden border border-border/80 bg-card shadow-lg glass-panel-hover flex flex-col justify-between"
              >
                {/* Image Background Container */}
                <div className="relative h-56 w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tribe.image}
                    alt={tribe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${tribe.color} opacity-75 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Header Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold">
                      {tribe.popularPurpose}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Text */}
                  <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                    <h3 className="font-extrabold text-lg leading-snug font-display">
                      {tribe.title}
                    </h3>
                    <p className="text-[11px] text-white/80 line-clamp-1">
                      {tribe.subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Content & Tags */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {tribe.badges.map((b) => (
                      <span
                        key={b}
                        className="px-2.5 py-0.5 rounded-lg bg-muted text-[11px] font-medium text-foreground"
                      >
                        #{b}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-border/80 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">
                      {tribe.stat}
                    </span>
                    <Link href="/discover">
                      <span className="text-primary font-bold hover:underline cursor-pointer">
                        Connect →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE "QUICK VIBE FINDER" TOOL */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="rounded-3xl glass-panel border border-primary/30 p-8 sm:p-12 space-y-8 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-2">
            <Badge variant="teal" className="text-xs font-bold uppercase tracking-widest">
              Instant Preview
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
              See who you&apos;d match with right now.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Select your academic background and your ideal college weekend to preview real student profiles ready to connect.
            </p>
          </div>

          {/* Interactive Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                1. Your Department / Course
              </label>
              <select
                value={finderBranch}
                onChange={(e) => setFinderBranch(e.target.value)}
                className="w-full h-12 rounded-2xl border border-input bg-card px-4 text-xs font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="CSE & Tech">B.Tech Computer Science & AI</option>
                <option value="Design">Bachelor of Design (B.Des / UI/UX)</option>
                <option value="Business">BBA / MBA Business School</option>
                <option value="ECE">B.Tech Electronics & VLSI</option>
                <option value="Biotech">B.Tech Biotechnology & Sciences</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                2. Your Weekend Campus Vibe
              </label>
              <select
                value={finderVibe}
                onChange={(e) => setFinderVibe(e.target.value)}
                className="w-full h-12 rounded-2xl border border-input bg-card px-4 text-xs font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="Hackathon & Dev">🏆 24hr Hackathon Prototype Sprint</option>
                <option value="Sports">🏸 Evening Badminton Doubles & Fitness</option>
                <option value="Chai & Music">☕ Sunset Chai, Amphitheatre & Indie Jam</option>
                <option value="Library">📚 Quiet Library Sprints & Placement DSA</option>
              </select>
            </div>
          </div>

          {/* Matching Student Cards Preview */}
          <div className="space-y-3 pt-4 border-t border-border/80">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Top Campus Matches Found:</span>
              <span className="text-teal-600 dark:text-teal-400">92% Average Vibe Synergy</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {matchingStudents.map((st) => (
                <div
                  key={st.profile.id}
                  className="p-4 rounded-2xl border border-border bg-card/80 space-y-3 shadow-sm hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={st.profile.avatar_url || ""}
                        alt={st.profile.full_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">
                        {st.profile.full_name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {st.profile.branch} • Year {st.profile.year}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-background border border-border/80">
                    <VibeMeter score={st.profile.id === "u_aarav_01" ? 94 : st.profile.id === "u_ananya_02" ? 91 : 88} size="sm" />
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-2 italic">
                    &ldquo;{st.profile.bio}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[10px] font-bold text-secondary">
                      🎯 {st.purposes[0]}
                    </span>
                    <Link href="/discover">
                      <Button size="sm" variant="vibe" className="h-7 px-3 text-[11px] font-bold">
                        Say Hi
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. AUTHENTIC STUDENT WALL OF LOVE */}
      <section className="w-full py-16 md:py-24 bg-card/40 border-t border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="violet" className="text-xs font-bold uppercase tracking-widest px-3 py-1">
              Real Campus Stories
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground font-display">
              Loved by students who hate cringe networking.
            </h2>
            <p className="text-sm text-muted-foreground">
              Authentic stories from university peers who found their squad, hackathon partners, and friends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card
                key={t.name}
                className="p-6 sm:p-7 rounded-3xl border border-border bg-card space-y-4 shadow-sm glass-panel-hover flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400 text-sm">
                      ★★★★★
                    </div>
                    <Badge variant="teal" className="text-[10px] font-bold">
                      {t.vibeMatch}
                    </Badge>
                  </div>

                  <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-border/80 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl overflow-hidden border border-border shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{t.name}</h4>
                    <p className="text-[11px] text-muted-foreground">{t.branch}</p>
                    <span className="text-[10px] font-semibold text-primary">{t.university}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DPDP ACT 2023 SAFETY MATRIX */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="rounded-3xl vibe-gradient-subtle border border-primary/20 p-8 sm:p-12 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Student Privacy & Safety Guarantee</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
                Built with India&apos;s DPDP Act 2023 at its core.
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Campus networking must be dignified, safe, and transparent. We enforce complete data minimization:
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
                    <strong className="block">20 Requests/Day Rate Limit</strong>
                    <span className="text-muted-foreground">
                      Strict limit to completely prevent spam, creeping, or bot harassment.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Universal Block & Report</strong>
                    <span className="text-muted-foreground">
                      Blocked users vanish immediately and permanently from all recommendations.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">One-Click Account Deletion</strong>
                    <span className="text-muted-foreground">
                      Statutory right to permanent erasure of all records and interests.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-card border border-border space-y-3">
              <div className="font-bold text-sm text-foreground flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span>Accredited University Domains</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Only verified institutional university emails can access the network:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {allowed.map((d) => (
                  <span
                    key={d}
                    className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold"
                  >
                    @{d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="violet" className="text-xs font-bold uppercase tracking-widest">
            FAQ
          </Badge>
          <h2 className="text-3xl font-extrabold text-foreground font-display">
            Frequently Asked Questions
          </h2>
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

      {/* 8. HIGH-CONVERTING BOTTOM CTA */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl vibe-gradient p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight leading-tight">
              Ready to meet your people on campus?
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
              Join students across engineering, design, business, and sciences finding their squad on Vibe Check today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/discover" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-violet-900 hover:bg-white/90 font-extrabold text-sm h-12 px-8 shadow-xl">
                <span>Start Discovering Peers</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 font-bold text-sm h-12 px-6">
                <span>Sign Up with University Email</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

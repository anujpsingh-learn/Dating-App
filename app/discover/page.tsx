"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  Filter,
  Search,
  Sparkles,
  Send,
  ShieldAlert,
  UserCheck,
  Check,
  Clock,
  Building,
  GraduationCap,
  Calendar,
  Languages,
  Flame,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  Lock,
  ArrowRight,
  Eye,
  Grid,
  Map,
  ShieldCheck,
  BookOpen,
  Code,
  Coffee,
  Dumbbell,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VibeMeter } from "@/components/ui/vibe-meter";
import { InterestChip } from "@/components/ui/interest-chip";
import { SayHiModal } from "@/components/ui/say-hi-modal";
import { ReportModal } from "@/components/ui/report-modal";
import { StudentDossierModal } from "@/components/ui/student-dossier-modal";
import { useCampus } from "@/lib/campus-store";
import { CandidateCard, Profile } from "@/types/database";
import { CAMPUS_PURPOSES } from "@/lib/interests-data";

export default function DiscoverPage() {
  const { getRecommendations, currentUser } = useCampus();

  // Filters state
  const [filterPurpose, setFilterPurpose] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<number>(0);
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [sortBy, setSortBy] = useState<string>("vibe");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Selected language filter
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  // Modal interaction states
  const [sayHiCandidate, setSayHiCandidate] = useState<CandidateCard | null>(null);
  const [dossierCandidate, setDossierCandidate] = useState<CandidateCard | null>(null);
  const [reportTargetProfile, setReportTargetProfile] = useState<Profile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Recommendations calculated via matching algorithm
  const candidates = useMemo(() => {
    let list = getRecommendations({
      filterPurpose,
      filterYear,
      filterBranch,
      searchQuery,
    });

    if (selectedLanguage) {
      list = list.filter((c) =>
        c.profile.languages?.some((l) =>
          l.toLowerCase().includes(selectedLanguage.toLowerCase())
        )
      );
    }

    if (sortBy === "vibe") {
      list.sort((a, b) => b.vibe_score - a.vibe_score);
    } else if (sortBy === "year") {
      list.sort((a, b) => b.profile.year - a.profile.year);
    } else if (sortBy === "shared") {
      list.sort((a, b) => b.shared_likes.length - a.shared_likes.length);
    }

    return list;
  }, [
    getRecommendations,
    filterPurpose,
    filterYear,
    filterBranch,
    searchQuery,
    selectedLanguage,
    sortBy,
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResetFilters = () => {
    setFilterPurpose("all");
    setFilterYear(0);
    setFilterBranch("all");
    setSearchQuery("");
    setSelectedLanguage(null);
    setAvailabilityFilter("all");
    setRadiusKm(5);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-foreground text-background text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-secondary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Ambient Lighting Accents */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="absolute -top-12 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-48 right-10 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Header & Editorial Breadcrumb Section */}
        <section className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span>Campus Directory</span>
              <span>/</span>
              <span className="text-primary">University Central Hub</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>{candidates.length} Students Active &amp; Ready to Connect</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/70 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-foreground tracking-tight">
                Browse Vetted Students
              </h1>
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2 max-w-2xl">
                <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
                <span>
                  Showing <strong className="text-foreground">{candidates.length} verified peers</strong> authenticated with university credentials (.edu / .in) and platonic conduct agreements.
                </span>
              </p>
            </div>

            {/* Active Pill Tags Strip */}
            <div className="flex flex-wrap items-center gap-2">
              {filterPurpose !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-xs font-medium">
                  <span>Goal: {filterPurpose}</span>
                  <button
                    onClick={() => setFilterPurpose("all")}
                    className="hover:text-primary transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
              {filterYear > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-xs font-medium">
                  <span>Year {filterYear}</span>
                  <button
                    onClick={() => setFilterYear(0)}
                    className="hover:text-primary transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedLanguage && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-medium">
                  <span>{selectedLanguage}</span>
                  <button
                    onClick={() => setSelectedLanguage(null)}
                    className="hover:text-primary transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
              {(filterPurpose !== "all" || filterYear > 0 || selectedLanguage || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors font-medium ml-1"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Main Directory Split Grid (12 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT FILTER SIDEBAR (4 cols on lg, 3 cols on xl) */}
          <aside className="lg:col-span-4 xl:col-span-3 w-full bg-card rounded-2xl p-6 border border-border shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <h2 className="font-headline font-bold text-base text-foreground">
                  Curate Criteria
                </h2>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Search Students
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Name, skills, branch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-muted/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Campus Radius Slider */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Campus Locale &amp; Radius
              </label>
              <div className="p-3 rounded-xl bg-muted/50 border border-border/60 text-xs text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary shrink-0" />
                <span className="truncate">Central Campus &amp; Hostels</span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Radius limit</span>
                  <span className="font-semibold text-foreground">{radiusKm} km</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-1.5 bg-muted rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground pt-0.5">
                  <span>Campus Blocks</span>
                  <span>10 km</span>
                  <span>City Hub</span>
                </div>
              </div>
            </div>

            {/* Availability Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Availability
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted/60 rounded-xl">
                {["all", "today", "weekend"].map((avail) => (
                  <button
                    key={avail}
                    onClick={() => setAvailabilityFilter(avail)}
                    className={`py-1.5 px-2 text-center rounded-lg text-xs font-semibold capitalize transition-all ${
                      availabilityFilter === avail
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {avail === "all" ? "Anytime" : avail}
                  </button>
                ))}
              </div>
            </div>

            {/* Campus Goal / Occasion Checkboxes */}
            <div className="space-y-2.5 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Campus Occasion &amp; Intent
              </label>
              <div className="space-y-2 text-xs text-foreground">
                {[
                  { id: "all", label: "All Intentions" },
                  { id: "Study Partners", label: "Study Sprints & Exams" },
                  { id: "Project Teammates", label: "Hackathons & Coding" },
                  { id: "Sports & Hobbies", label: "Badminton & Gym" },
                  { id: "Campus Events", label: "Fests & Cultural Nights" },
                  { id: "Friends", label: "Campus Chai & Friends" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2.5 cursor-pointer select-none group"
                  >
                    <input
                      type="radio"
                      name="purposeRadio"
                      checked={filterPurpose === item.id}
                      onChange={() => setFilterPurpose(item.id)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span className="group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Academic Year Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Academic Year
              </label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                className="w-full h-10 rounded-xl bg-muted/60 px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-transparent"
              >
                <option value={0}>All Academic Years</option>
                <option value={1}>1st Year (Freshmen)</option>
                <option value={2}>2nd Year (Sophomores)</option>
                <option value={3}>3rd Year (Juniors)</option>
                <option value={4}>4th Year (Seniors)</option>
              </select>
            </div>

            {/* Trust & Vetting Perks */}
            <div className="space-y-3 pt-3 p-3.5 bg-secondary/10 rounded-xl border border-secondary/20">
              <div className="flex items-center gap-2 text-secondary">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold text-foreground">Vetting Standards</span>
              </div>
              <div className="space-y-2 text-xs text-foreground">
                <div className="flex items-center justify-between">
                  <span>Institutional Email Verified</span>
                  <Check className="w-3.5 h-3.5 text-secondary" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Hostel / Day Scholar Vetted</span>
                  <Check className="w-3.5 h-3.5 text-secondary" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Platonic Conduct Charter</span>
                  <Check className="w-3.5 h-3.5 text-secondary" />
                </div>
              </div>
            </div>

            {/* Spoken Languages */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Languages Spoken
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["English", "Hindi", "Punjabi", "Bengali", "Telugu", "Tamil"].map(
                  (lang) => {
                    const isSelected = selectedLanguage === lang;
                    return (
                      <button
                        key={lang}
                        onClick={() =>
                          setSelectedLanguage(isSelected ? null : lang)
                        }
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-primary text-white shadow-sm"
                            : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary"
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Safe Public Venue Charter Reminder */}
            <div className="p-3 bg-muted/70 rounded-xl flex items-start gap-2.5 text-xs text-muted-foreground">
              <Lock className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                All Vibe Check engagements take place strictly in verified public campus spaces under our mutual student safety pledge.
              </p>
            </div>
          </aside>

          {/* RIGHT STUDENT CARDS DIRECTORY (8 cols on lg, 9 cols on xl) */}
          <section className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Directory Control Strip (Sort By, View Mode) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-muted-foreground">
                  Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-muted/60 text-xs font-bold text-foreground py-2 pl-3 pr-8 rounded-xl cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary border-none"
                >
                  <option value="vibe">Curated / Highest Vibe Match</option>
                  <option value="shared">Most Shared Passions</option>
                  <option value="year">Seniority (Year High to Low)</option>
                </select>
              </div>

              {/* View Switcher */}
              <div className="flex items-center bg-muted/60 p-1 rounded-xl self-end sm:self-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === "grid"
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === "map"
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Campus Map</span>
                </button>
              </div>
            </div>

            {/* Map Preview Placeholder if selected */}
            {viewMode === "map" && (
              <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-headline font-bold text-lg text-foreground">
                  Interactive Campus Hub Map
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Pinpoints active student study clusters at Central Library, Student Center, and Cafeteria without revealing private room numbers.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setViewMode("grid")}
                  className="text-xs"
                >
                  Switch back to Grid
                </Button>
              </div>
            )}

            {/* Empty State */}
            {candidates.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-card border border-border space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
                  <Compass className="w-7 h-7" />
                </div>
                <h3 className="font-headline font-bold text-xl text-foreground">
                  No Matching Students Found
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Try relaxing your criteria, choosing a different campus goal, or resetting filters.
                </p>
                <Button onClick={handleResetFilters} className="text-xs">
                  Reset All Filters
                </Button>
              </div>
            )}

            {/* 3-Column Editorial Student Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {candidates.map((candidate) => {
                const p = candidate.profile;
                return (
                  <article
                    key={p.id}
                    className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Photo Container (4:5 Aspect Ratio) */}
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            p.avatar_url ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
                          }
                          alt={p.full_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                        {/* Top Left: Live Status Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/90 backdrop-blur-md shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                          <span className="text-[11px] font-bold text-foreground">
                            Active on Campus
                          </span>
                        </div>

                        {/* Top Right: Vibe Match Pill */}
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-white text-xs font-black shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{candidate.vibe_score}% Vibe</span>
                        </div>

                        {/* Floating Bottom Card Details on Photo */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/90 backdrop-blur-md font-semibold text-[11px]">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>.edu Verified</span>
                          </div>
                          <span className="text-[11px] font-medium bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                            {p.hostel_or_day}
                          </span>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <h3 className="font-headline font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                              {p.full_name}
                            </h3>
                            <span className="text-xs text-muted-foreground font-medium">
                              Year {p.year} • {p.branch}
                            </span>
                          </div>
                        </div>

                        {/* Bio snippet */}
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {p.bio || "Looking to connect for productive study sessions and genuine campus friendships."}
                        </p>

                        {/* Shared Passion Chips */}
                        <div className="pt-1">
                          {candidate.shared_likes.length > 0 ? (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                                You both like:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {candidate.shared_likes.slice(0, 3).map((item) => (
                                  <span
                                    key={item}
                                    className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary text-[11px] font-semibold flex items-center gap-1"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>{item}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {candidate.shared_purposes.slice(0, 3).map((item) => (
                                <span
                                  key={item}
                                  className="px-2.5 py-0.5 rounded-full bg-muted text-foreground text-[11px] font-medium"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-5 pt-0 border-t border-border/60 mt-2">
                      <div className="flex items-center gap-2 pt-3">
                        <button
                          onClick={() => setDossierCandidate(candidate)}
                          className="flex-1 h-10 px-3 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>Dossier</span>
                        </button>

                        <button
                          onClick={() => setSayHiCandidate(candidate)}
                          className="flex-1 h-10 px-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Say Hi</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* Student Editorial Dossier Modal */}
      <StudentDossierModal
        candidate={dossierCandidate}
        isOpen={!!dossierCandidate}
        onClose={() => setDossierCandidate(null)}
        onSayHi={(c) => {
          setDossierCandidate(null);
          setSayHiCandidate(c);
        }}
      />

      {/* Say Hi & Plan Campus Meetup Modal */}
      <SayHiModal
        candidate={sayHiCandidate}
        isOpen={!!sayHiCandidate}
        onClose={() => setSayHiCandidate(null)}
        onSuccess={() => {
          showToast(
            `Campus meetup request dispatched to ${sayHiCandidate?.profile.full_name}!`
          );
        }}
      />

      {/* Safety Report Modal */}
      <ReportModal
        profile={reportTargetProfile}
        isOpen={!!reportTargetProfile}
        onClose={() => setReportTargetProfile(null)}
        onSuccess={() => {
          showToast("Report submitted to campus safety moderator.");
        }}
      />
    </div>
  );
}

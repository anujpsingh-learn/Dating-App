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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VibeMeter } from "@/components/ui/vibe-meter";
import { InterestChip } from "@/components/ui/interest-chip";
import { SayHiModal } from "@/components/ui/say-hi-modal";
import { ReportModal } from "@/components/ui/report-modal";
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

  // Modal interaction states
  const [sayHiCandidate, setSayHiCandidate] = useState<CandidateCard | null>(null);
  const [reportTargetProfile, setReportTargetProfile] = useState<Profile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Recommendations calculated via matching algorithm
  const candidates = useMemo(() => {
    return getRecommendations({
      filterPurpose,
      filterYear,
      filterBranch,
      searchQuery,
    });
  }, [getRecommendations, filterPurpose, filterYear, filterBranch, searchQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-mesh-pattern">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-foreground text-background text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-secondary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <Compass className="w-4 h-4" />
            <span>Campus Discover Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground font-display tracking-tight">
            Find Your Campus People
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Ranked by shared university passions, top 3 interests, hackathon/study goals, and academic proximity.
          </p>
        </div>

        {/* User vibe status preview */}
        {currentUser && (
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl glass-panel shadow-sm">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/40 shrink-0 flex items-center justify-center font-bold text-primary shadow-sm">
              {currentUser.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentUser.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                currentUser.full_name?.charAt(0) || "U"
              )}
            </div>
            <div className="text-xs">
              <div className="font-extrabold text-foreground flex items-center gap-1.5">
                <span>{currentUser.full_name || "You"}</span>
                <span className="w-2 h-2 rounded-full bg-teal-500" title="Online" />
              </div>
              <div className="text-muted-foreground text-[11px] font-medium">
                {currentUser.branch} • Year {currentUser.year}
              </div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                {currentUser.hostel_or_day}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, branch, interests (e.g. AI, badminton, Figma, hackathons)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background/80 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
            />
          </div>

          {/* Academic Year Filter */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(parseInt(e.target.value))}
            className="h-11 rounded-xl border border-input bg-background/80 px-3.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value={0}>All Academic Years</option>
            <option value={1}>1st Year (Freshmen)</option>
            <option value={2}>2nd Year (Sophomores)</option>
            <option value={3}>3rd Year (Juniors)</option>
            <option value={4}>4th Year (Seniors)</option>
            <option value={5}>5th Year (Dual/PG)</option>
          </select>
        </div>

        {/* Campus Purpose Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-muted-foreground mr-1 shrink-0 uppercase tracking-wider">
            Campus Goal:
          </span>
          <button
            onClick={() => setFilterPurpose("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              filterPurpose === "all"
                ? "bg-primary text-white border-primary shadow-sm shadow-primary/25"
                : "border-border bg-background/80 text-muted-foreground hover:bg-muted"
            }`}
          >
            All Goals
          </button>
          {CAMPUS_PURPOSES.map((p) => (
            <button
              key={p.id}
              onClick={() => setFilterPurpose(p.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                filterPurpose === p.id
                  ? "bg-primary text-white border-primary shadow-sm shadow-primary/25"
                  : "border-border bg-background/80 text-muted-foreground hover:bg-muted"
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Recommendation Cards (Not a swipe stack) */}
      {candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => {
            const { profile, vibe_score, shared_likes, top_shared_likes, shared_purposes, connection_status } =
              candidate;

            const isHighVibe = vibe_score >= 85;

            return (
              <div
                key={profile.id}
                className={`rounded-3xl border glass-panel p-6 flex flex-col justify-between space-y-5 transition-all duration-300 relative overflow-hidden group glass-panel-hover shadow-lg ${
                  isHighVibe ? "border-primary/50 dark:border-primary/60" : "border-border/80"
                }`}
              >
                {/* Ambient glow accent for high matches */}
                {isHighVibe && (
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-violet-500/15 to-teal-500/15 rounded-full blur-2xl -z-10" />
                )}

                {/* Top Corner Safety / Report button */}
                <button
                  onClick={() => setReportTargetProfile(profile)}
                  title="Report or block user"
                  className="absolute top-5 right-5 text-muted-foreground hover:text-destructive p-1.5 rounded-full hover:bg-muted transition-colors opacity-60 group-hover:opacity-100"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span className="sr-only">Report user</span>
                </button>

                {/* Student Avatar & Basic Info */}
                <div className="flex items-start gap-4 pr-7">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/40 shrink-0 shadow-md">
                      {profile.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center font-bold text-2xl text-primary">
                          {profile.full_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span
                      className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-teal-500 border-2 border-card"
                      title="Active Student"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors">
                        {profile.full_name}
                      </h3>
                      <span className="text-xs font-semibold text-muted-foreground">
                        • {profile.age}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-foreground">
                      {profile.branch}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      Year {profile.year} • {profile.hostel_or_day}
                    </p>
                  </div>
                </div>

                {/* Vibe Meter */}
                <div className="p-3.5 rounded-2xl bg-card/90 border border-border/80 space-y-1 shadow-inner">
                  <VibeMeter score={vibe_score} size="default" />
                </div>

                {/* Bio */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 italic">
                  &ldquo;{profile.bio}&rdquo;
                </p>

                {/* Shared Likes Highlights */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-secondary" />
                    <span>You both like:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {shared_likes.slice(0, 4).map((name) => (
                      <span
                        key={name}
                        className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/30"
                      >
                        {name}
                      </span>
                    ))}
                    {shared_likes.length > 4 && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-medium text-muted-foreground bg-muted">
                        +{shared_likes.length - 4} more
                      </span>
                    )}
                    {shared_likes.length === 0 && (
                      <span className="text-[11px] text-muted-foreground italic">
                        Shared campus routines & goals
                      </span>
                    )}
                  </div>
                </div>

                {/* Shared Purposes Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {shared_purposes.map((p) => (
                    <span
                      key={p}
                      className="px-2.5 py-0.5 rounded-lg bg-teal-500/15 text-teal-700 dark:text-teal-300 text-[10px] font-bold border border-teal-500/20"
                    >
                      🎯 {p}
                    </span>
                  ))}
                </div>

                {/* Action Button: "Say Hi" / Connected / Pending */}
                <div className="pt-2 border-t border-border/80">
                  {connection_status === "accepted" ? (
                    <Link href="/connections">
                      <Button variant="outline" className="w-full gap-2 text-xs border-teal-500/40 text-teal-600 dark:text-teal-400 font-bold">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Connected • View Verified Contact</span>
                      </Button>
                    </Link>
                  ) : connection_status === "pending" ? (
                    <Button variant="outline" disabled className="w-full gap-2 text-xs opacity-80 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Request Sent • Pending</span>
                    </Button>
                  ) : (
                    <Button
                      variant="vibe"
                      onClick={() => setSayHiCandidate(candidate)}
                      className="w-full gap-2 font-extrabold shadow-md shadow-primary/25 h-11"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Say Hi & Connect</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <Card className="p-12 rounded-3xl border border-dashed border-border bg-card/60 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto text-xl">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-foreground">
              No matching peers found with current filters
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your goal or year filters, or search for different terms to find classmates.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilterPurpose("all");
              setFilterYear(0);
              setFilterBranch("all");
              setSearchQuery("");
            }}
          >
            Reset All Filters
          </Button>
        </Card>
      )}

      {/* Say Hi Modal */}
      <SayHiModal
        candidate={sayHiCandidate}
        isOpen={!!sayHiCandidate}
        onClose={() => setSayHiCandidate(null)}
        onSuccess={() => showToast("Connection request sent with your intro note!")}
      />

      {/* Report & Block Modal */}
      <ReportModal
        profile={reportTargetProfile}
        isOpen={!!reportTargetProfile}
        onClose={() => setReportTargetProfile(null)}
        onSuccess={(msg) => showToast(msg)}
      />
    </div>
  );
}

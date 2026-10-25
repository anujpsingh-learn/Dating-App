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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-foreground text-background text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-secondary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Compass className="w-4 h-4" />
            <span>Discover Campus Peers</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground font-display">
            Find Your People
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Ranked by your shared passions, top 3 interests, campus goals, and academic synergy.
          </p>
        </div>

        {/* User vibe status preview */}
        {currentUser && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 overflow-hidden flex items-center justify-center font-bold text-primary">
              {currentUser.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentUser.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                currentUser.full_name?.charAt(0) || "U"
              )}
            </div>
            <div className="text-xs">
              <div className="font-bold text-foreground">
                Active: {currentUser.full_name || "You"}
              </div>
              <div className="text-muted-foreground text-[11px]">
                {currentUser.branch} • Year {currentUser.year}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-3xl bg-card border border-border shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, branch, interests, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          {/* Academic Year Filter */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(parseInt(e.target.value))}
            className="h-10 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value={0}>All Academic Years</option>
            <option value={1}>1st Year</option>
            <option value={2}>2nd Year</option>
            <option value={3}>3rd Year</option>
            <option value={4}>4th Year</option>
            <option value={5}>5th Year</option>
          </select>
        </div>

        {/* Campus Purpose Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-muted-foreground mr-1.5 shrink-0">
            Goal:
          </span>
          <button
            onClick={() => setFilterPurpose("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              filterPurpose === "all"
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            All Goals
          </button>
          {CAMPUS_PURPOSES.map((p) => (
            <button
              key={p.id}
              onClick={() => setFilterPurpose(p.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
                filterPurpose === p.id
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
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

            return (
              <Card
                key={profile.id}
                className="rounded-3xl border border-border/80 bg-card p-6 flex flex-col justify-between space-y-5 hover:border-primary/40 hover:shadow-lg transition-all relative overflow-hidden group"
              >
                {/* Top Corner Safety / Report button */}
                <button
                  onClick={() => setReportTargetProfile(profile)}
                  title="Report or block user"
                  className="absolute top-5 right-5 text-muted-foreground hover:text-destructive p-1.5 rounded-full hover:bg-muted transition-colors opacity-70 group-hover:opacity-100"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span className="sr-only">Report user</span>
                </button>

                {/* Student Avatar & Basic Info */}
                <div className="flex items-start gap-3.5 pr-8">
                  <div className="w-14 h-14 rounded-2xl bg-muted overflow-hidden border border-border shrink-0 flex items-center justify-center font-bold text-xl text-primary shadow-sm">
                    {profile.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profile.full_name.charAt(0)
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {profile.full_name}
                      <span className="text-xs font-normal text-muted-foreground">
                        ({profile.age})
                      </span>
                    </h3>
                    <p className="text-xs font-medium text-foreground">
                      {profile.branch}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Year {profile.year} • {profile.hostel_or_day}
                    </p>
                  </div>
                </div>

                {/* Vibe Meter */}
                <div className="p-3 rounded-2xl bg-background border border-border/70 space-y-1">
                  <VibeMeter score={vibe_score} size="default" />
                </div>

                {/* Bio */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  &ldquo;{profile.bio}&rdquo;
                </p>

                {/* Shared Likes Highlights */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-secondary" />
                    <span>You both like:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {shared_likes.slice(0, 4).map((name) => (
                      <span
                        key={name}
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/25"
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
                        Shared campus purpose & routines
                      </span>
                    )}
                  </div>
                </div>

                {/* Shared Purposes Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {shared_purposes.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded-lg bg-secondary/10 text-secondary text-[10px] font-bold"
                    >
                      🎯 {p}
                    </span>
                  ))}
                </div>

                {/* Action Button: "Say Hi" / Connected / Pending */}
                <div className="pt-2 border-t border-border/80">
                  {connection_status === "accepted" ? (
                    <Link href="/connections">
                      <Button variant="outline" className="w-full gap-2 text-xs border-secondary/40 text-secondary">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Connected • View Details</span>
                      </Button>
                    </Link>
                  ) : connection_status === "pending" ? (
                    <Button variant="outline" disabled className="w-full gap-2 text-xs opacity-80">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Request Sent • Pending</span>
                    </Button>
                  ) : (
                    <Button
                      variant="vibe"
                      onClick={() => setSayHiCandidate(candidate)}
                      className="w-full gap-2 font-bold shadow-md shadow-primary/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Say Hi & Connect</span>
                    </Button>
                  )}
                </div>
              </Card>
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
              No matching peers found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your purpose or year filters, or search for different terms to find campus classmates.
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

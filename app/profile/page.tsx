"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Sliders,
  Sparkles,
  Save,
  Star,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { InterestChip } from "@/components/ui/interest-chip";
import { useCampus } from "@/lib/campus-store";
import { MASTER_INTERESTS, SAMPLE_COURSES } from "@/lib/interests-data";
import { ResidencyType, Gender } from "@/types/database";

export default function ProfilePage() {
  const { currentUser, userInterests, userPurposes, updateProfile, setUserInterests } =
    useCampus();

  const [fullName, setFullName] = useState(currentUser?.full_name || "");
  const [course, setCourse] = useState(currentUser?.course || SAMPLE_COURSES[0]);
  const [branch, setBranch] = useState(currentUser?.branch || "CSE");
  const [year, setYear] = useState<number>(currentUser?.year || 2);
  const [hostelOrDay, setHostelOrDay] = useState<ResidencyType>(
    currentUser?.hostel_or_day || "Hostel"
  );
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || "");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName.trim(),
      course,
      branch: branch.trim(),
      year,
      hostel_or_day: hostelOrDay,
      bio: bio.trim(),
      avatar_url: avatarUrl.trim() || null,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast */}
      {isSaved && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-secondary text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <User className="w-4 h-4" />
            <span>Profile Management</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground font-display">
            My Campus Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your public bio, branch details, and campus passions.
          </p>
        </div>

        <Link href="/settings">
          <Button variant="outline" className="gap-2 text-xs">
            <Sliders className="w-4 h-4 text-secondary" />
            <span>Privacy Controls</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Profile Card Preview */}
        <div className="md:col-span-5 space-y-6">
          <Card className="p-6 rounded-3xl border border-border bg-card space-y-5 shadow-sm text-center">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 mx-auto overflow-hidden border-2 border-primary/20 flex items-center justify-center font-bold text-3xl text-primary shadow-md shadow-primary/20">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                fullName.charAt(0) || "U"
              )}
            </div>

            <div className="space-y-1">
              <h2 className="font-extrabold text-xl text-foreground">
                {fullName || "Student Name"}
              </h2>
              <p className="text-xs font-medium text-foreground">{branch}</p>
              <p className="text-[11px] text-muted-foreground">
                Year {year} • {hostelOrDay}
              </p>
            </div>

            <p className="text-xs text-muted-foreground italic leading-relaxed px-2">
              &ldquo;{bio || "No bio added yet."}&rdquo;
            </p>

            <div className="pt-3 border-t border-border/80 text-left space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Campus Goals
              </div>
              <div className="flex flex-wrap gap-1">
                {userPurposes.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-0.5 rounded-lg bg-secondary/10 text-secondary text-[11px] font-bold"
                  >
                    🎯 {p}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-7 space-y-6">
          <Card className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-6 shadow-sm">
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Course
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {SAMPLE_COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Branch / Department"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                    <option value={5}>5th Year</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Residency Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Hostel", "Day Scholar"] as ResidencyType[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setHostelOrDay(r)}
                      className={`h-11 rounded-xl text-xs font-semibold border transition-all ${
                        hostelOrDay === r
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-input bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Profile Photo URL"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    One-Line Bio (Max 150 chars)
                  </label>
                  <span
                    className={`text-xs ${
                      bio.length > 140 ? "text-amber-500 font-bold" : "text-muted-foreground"
                    }`}
                  >
                    {bio.length} / 150
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={150}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-background p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="vibe" size="lg" className="w-full gap-2 font-bold">
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </Button>
              </div>
            </form>
          </Card>

          {/* Interests preview & edit shortcut */}
          <Card className="p-6 rounded-3xl border border-border bg-card space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span>My Active Interests ({userInterests.length})</span>
              </div>
              <Link href="/onboarding">
                <span className="text-xs font-semibold text-primary hover:underline">
                  Reconfigure Interests →
                </span>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {userInterests.map((ui) => {
                const master = MASTER_INTERESTS.find((m) => m.id === ui.interest_id);
                return (
                  <InterestChip
                    key={ui.id}
                    id={ui.interest_id}
                    name={master?.name || ui.interest_id}
                    icon={master?.icon}
                    state={ui.type}
                    isTop={ui.is_top}
                  />
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

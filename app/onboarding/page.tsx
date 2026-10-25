"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Star,
  Plus,
  ThumbsDown,
  User,
  Heart,
  Target,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { InterestChip } from "@/components/ui/interest-chip";
import { useCampus } from "@/lib/campus-store";
import {
  MASTER_INTERESTS,
  CATEGORIES,
  CAMPUS_PURPOSES,
  CAMPUS_AVAILABILITY,
  POPULAR_LANGUAGES,
  SAMPLE_COURSES,
} from "@/lib/interests-data";
import {
  Gender,
  ResidencyType,
  CampusPurpose,
  AvailabilitySlot,
  UserInterest,
} from "@/types/database";

export default function OnboardingPage() {
  const router = useRouter();
  const {
    currentUser,
    userInterests,
    userPurposes,
    updateProfile,
    setUserInterests,
    setUserPurposes,
    completeOnboarding,
  } = useCampus();

  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Resume from saved step if available
  useEffect(() => {
    if (currentUser?.onboarding_step && currentUser.onboarding_step < 4) {
      setStep(currentUser.onboarding_step);
    }
  }, [currentUser]);

  // Step 1: About You state
  const [fullName, setFullName] = useState(currentUser?.full_name || "");
  const [age, setAge] = useState<number>(currentUser?.age || 20);
  const [gender, setGender] = useState<Gender>(currentUser?.gender || "Prefer not to say");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [course, setCourse] = useState(currentUser?.course || SAMPLE_COURSES[0]);
  const [branch, setBranch] = useState(currentUser?.branch || "CSE");
  const [year, setYear] = useState<number>(currentUser?.year || 2);
  const [hostelOrDay, setHostelOrDay] = useState<ResidencyType>(
    currentUser?.hostel_or_day || "Hostel"
  );
  const [avatarUrl, setAvatarUrl] = useState(
    currentUser?.avatar_url ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
  );
  const [bio, setBio] = useState(
    currentUser?.bio ||
      "Passionate about tech projects, hackathons, and evening badminton. Looking for study and project teammates."
  );

  // Step 2: Interests state
  const [selectedInterests, setSelectedInterests] = useState<
    Map<string, { type: "like" | "dislike"; isTop: boolean }>
  >(() => {
    const map = new Map<string, { type: "like" | "dislike"; isTop: boolean }>();
    userInterests.forEach((ui) => {
      map.set(ui.interest_id, { type: ui.type, isTop: ui.is_top });
    });
    // Default seed picks if empty
    if (map.size === 0) {
      map.set("tech_ai", { type: "like", isTop: true });
      map.set("tech_web", { type: "like", isTop: true });
      map.set("sports_badminton", { type: "like", isTop: true });
      map.set("food_chai", { type: "like", isTop: false });
    }
    return map;
  });

  const [customInterest, setCustomInterest] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);

  // Step 3: Goals state
  const [selectedPurposes, setSelectedPurposes] = useState<CampusPurpose[]>(() => {
    return userPurposes.length > 0
      ? userPurposes
      : ["Study Partners", "Project Teammates", "Friends"];
  });

  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilitySlot[]>(() => {
    return (currentUser?.availability?.length ?? 0) > 0
      ? currentUser!.availability!
      : ["Weekday Evenings", "Weekends"];
  });

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(() => {
    return (currentUser?.languages?.length ?? 0) > 0
      ? currentUser!.languages!
      : ["English", "Hindi"];
  });

  // Top 3 count helper
  const topCount = Array.from(selectedInterests.values()).filter(
    (v) => v.type === "like" && v.isTop
  ).length;

  const toggleInterestLike = (id: string) => {
    setSelectedInterests((prev) => {
      const next = new Map(prev);
      const current = next.get(id);

      if (current?.type === "like") {
        next.delete(id);
      } else {
        // Default to like (not top)
        next.set(id, { type: "like", isTop: false });
      }
      return next;
    });
  };

  const toggleInterestDislike = (id: string) => {
    setSelectedInterests((prev) => {
      const next = new Map(prev);
      const current = next.get(id);

      if (current?.type === "dislike") {
        next.delete(id);
      } else {
        next.set(id, { type: "dislike", isTop: false });
      }
      return next;
    });
  };

  const toggleInterestTop = (id: string) => {
    setSelectedInterests((prev) => {
      const next = new Map(prev);
      const current = next.get(id);

      if (!current || current.type !== "like") {
        // If not already a like, make it like and top (if under 3)
        if (topCount < 3) {
          next.set(id, { type: "like", isTop: true });
        }
      } else {
        // Toggle top status
        if (current.isTop) {
          next.set(id, { ...current, isTop: false });
        } else if (topCount < 3) {
          next.set(id, { ...current, isTop: true });
        }
      }
      return next;
    });
  };

  // Step 1 Validation & Save
  const handleNextStep1 = () => {
    setError(null);
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (age < 18) {
      setError("Students must be at least 18 years old to join Vibe Check.");
      return;
    }
    if (!bio.trim() || bio.trim().length < 10) {
      setError("Please write at least a 10-character bio so peers know a bit about you.");
      return;
    }
    if (bio.length > 150) {
      setError("Bio cannot exceed 150 characters.");
      return;
    }

    // Auto-save Step 1 to profile
    updateProfile({
      full_name: fullName.trim(),
      age,
      gender,
      phone: phone.trim() || null,
      course,
      branch: branch.trim(),
      year,
      hostel_or_day: hostelOrDay,
      avatar_url: avatarUrl,
      bio: bio.trim(),
      onboarding_step: 2,
    });

    setStep(2);
  };

  // Step 2 Validation & Save
  const handleNextStep2 = () => {
    setError(null);
    const likes = Array.from(selectedInterests.entries()).filter(
      ([, val]) => val.type === "like"
    );

    if (likes.length < 3) {
      setError("Please pick at least 3 interests you like.");
      return;
    }

    // Transform into UserInterest records
    const records: UserInterest[] = Array.from(selectedInterests.entries()).map(
      ([interestId, val], idx) => ({
        id: `ui_usr_${idx}`,
        user_id: currentUser?.id || "u_curr",
        interest_id: interestId,
        type: val.type,
        is_top: val.isTop,
      })
    );

    setUserInterests(records);
    updateProfile({ onboarding_step: 3 });
    setStep(3);
  };

  // Step 3 Validation & Finalize
  const handleComplete = () => {
    setError(null);
    if (selectedPurposes.length === 0) {
      setError("Please select at least 1 campus goal (e.g. Study Partners or Friends).");
      return;
    }
    if (selectedAvailability.length === 0) {
      setError("Please select at least one availability window.");
      return;
    }
    if (selectedLanguages.length === 0) {
      setError("Please select at least one language.");
      return;
    }

    setUserPurposes(selectedPurposes);
    updateProfile({
      availability: selectedAvailability,
      languages: selectedLanguages,
      onboarding_step: 4,
    });
    completeOnboarding();
    router.push("/discover");
  };

  return (
    <div className="relative min-h-screen py-10 sm:py-16 overflow-hidden">
      {/* Background Campus Scene */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000"
          alt="University Campus Background"
          className="w-full h-full object-cover object-center opacity-20 dark:opacity-10 filter blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-8">
      {/* Step Progress Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Profile Setup • Step {step} of 3</span>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {step === 1 ? "33%" : step === 2 ? "66%" : "100%"} Completed
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full vibe-gradient rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
          {step === 1 && "About You & Campus Details"}
          {step === 2 && "Pick Your Passions & Top 3"}
          {step === 3 && "Campus Goals & Availability"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {step === 1 && "Tell campus peers who you are. Contact details are never revealed without mutual consent."}
          {step === 2 && "Select what you like (violet), dislike (strikethrough), and choose up to 3 top favorites (star)."}
          {step === 3 && "Specify what you’re hoping to find on campus and when you’re free to meet."}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: ABOUT YOU */}
      {step === 1 && (
        <Card className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              required
            />
            <Input
              label="Age (18+ Enforced)"
              type="number"
              min={18}
              max={40}
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 18)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full h-11 rounded-xl border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </div>

            <Input
              label="Phone Number (Optional - Revealed only on mutual acceptance)"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Course
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full h-11 rounded-xl border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {SAMPLE_COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full h-11 rounded-xl border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value={1}>1st Year (Freshman)</option>
                <option value={2}>2nd Year (Sophomore)</option>
                <option value={3}>3rd Year (Junior)</option>
                <option value={4}>4th Year (Senior)</option>
                <option value={5}>5th Year (Dual / Postgrad)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Branch / Specialization"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g. AI & ML / VLSI / Design"
              required
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Residence Status
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
                        : "border-input bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Photo selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Profile Photo (Optional)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden border border-border shrink-0 flex items-center justify-center font-bold text-xl text-muted-foreground">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  fullName.charAt(0) || "U"
                )}
              </div>
              <Input
                placeholder="Paste image URL (e.g. Unsplash or Cloudinary)"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Bio (Max 150 chars) */}
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
              placeholder="What are you currently learning, building, or looking to do together on campus?"
              className="w-full rounded-2xl border border-input bg-card p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border/80">
            <Button size="lg" variant="vibe" onClick={handleNextStep1} className="gap-2">
              <span>Save & Continue to Interests</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: CATEGORIZED CHIPS & TOP 3 */}
      {step === 2 && (
        <Card className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-6 shadow-sm">
          {/* Top 3 Reminder Banner */}
          <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>
                Pick your <strong>Top 3</strong> interests (they count <strong>double</strong> in the matching formula):
              </span>
            </div>
            <span className="font-bold text-secondary">
              {topCount} / 3 selected
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                  activeCategory === cat
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Chips in Active Category */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-foreground">
              {activeCategory} Chips:
            </div>
            <div className="flex flex-wrap gap-2.5">
              {MASTER_INTERESTS.filter((i) => i.category === activeCategory).map((i) => {
                const interestState = selectedInterests.get(i.id);
                return (
                  <InterestChip
                    key={i.id}
                    id={i.id}
                    name={i.name}
                    icon={i.icon}
                    state={interestState?.type || "neutral"}
                    isTop={interestState?.isTop || false}
                    interactive={true}
                    onToggleLike={toggleInterestLike}
                    onToggleDislike={toggleInterestDislike}
                    onToggleTop={toggleInterestTop}
                  />
                );
              })}
            </div>
          </div>

          {/* Free Text Other Interest */}
          <div className="space-y-2 pt-2 border-t border-border/80">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Add Custom Interest (Optional)
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Drone Racing, Standup Comedy, Origami"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                maxLength={40}
              />
              <Button
                type="button"
                variant="outline"
                className="gap-1.5 shrink-0"
                onClick={() => {
                  if (customInterest.trim()) {
                    const customId = "custom_" + customInterest.toLowerCase().replace(/\s+/g, "_");
                    setSelectedInterests((prev) => {
                      const next = new Map(prev);
                      next.set(customId, { type: "like", isTop: false });
                      return next;
                    });
                    setCustomInterest("");
                  }
                }}
              >
                <Plus className="w-4 h-4" />
                <span>Add Chip</span>
              </Button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-border/80">
            <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <Button size="lg" variant="vibe" onClick={handleNextStep2} className="gap-2">
              <span>Save & Continue to Goals</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: GOALS & AVAILABILITY */}
      {step === 3 && (
        <Card className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-6 shadow-sm">
          {/* Purposes / What are you looking for */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What are you looking for on campus? (Choose all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CAMPUS_PURPOSES.map((purpose) => {
                const isSelected = selectedPurposes.includes(purpose.id as CampusPurpose);
                return (
                  <div
                    key={purpose.id}
                    onClick={() => {
                      if (isSelected) {
                        if (selectedPurposes.length > 1) {
                          setSelectedPurposes(selectedPurposes.filter((p) => p !== purpose.id));
                        }
                      } else {
                        setSelectedPurposes([...selectedPurposes, purpose.id as CampusPurpose]);
                      }
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border hover:bg-muted bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 font-bold text-sm text-foreground">
                      <span className="text-xl">{purpose.icon}</span>
                      <span>{purpose.title}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {purpose.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-3 pt-4 border-t border-border/80">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              When are you usually free?
            </label>
            <div className="flex flex-wrap gap-2.5">
              {CAMPUS_AVAILABILITY.map((slot) => {
                const isSelected = selectedAvailability.includes(slot as AvailabilitySlot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        if (selectedAvailability.length > 1) {
                          setSelectedAvailability(selectedAvailability.filter((s) => s !== slot));
                        }
                      } else {
                        setSelectedAvailability([...selectedAvailability, slot as AvailabilitySlot]);
                      }
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? "border-secondary bg-secondary/15 text-secondary-800 dark:text-secondary-200 font-bold"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Languages Spoken */}
          <div className="space-y-3 pt-4 border-t border-border/80">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Languages Spoken
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_LANGUAGES.map((lang) => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        if (selectedLanguages.length > 1) {
                          setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
                        }
                      } else {
                        setSelectedLanguages([...selectedLanguages, lang]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-border/80">
            <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <Button size="lg" variant="vibe" onClick={handleComplete} className="gap-2 font-bold px-8">
              <span>Complete Profile & Discover</span>
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
      </div>
    </div>
  );
}

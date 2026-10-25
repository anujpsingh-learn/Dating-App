"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Profile,
  UserInterest,
  CampusPurpose,
  ConnectionRequest,
  PrivacySettings,
  Block,
  Report,
  CampusGroup,
  CampusEvent,
  CandidateCard,
} from "@/types/database";
import { SEED_STUDENTS, SeedStudent } from "./seed-data";
import { rankCandidates, UserMatchingProfile, CandidateMatchingProfile } from "./matching";

interface CampusContextType {
  currentUser: Profile | null;
  userInterests: UserInterest[];
  userPurposes: CampusPurpose[];
  privacySettings: PrivacySettings;
  connectionRequests: ConnectionRequest[];
  blocks: Block[];
  reports: Report[];
  campusGroups: CampusGroup[];
  campusEvents: CampusEvent[];
  sayHiCountToday: number;
  maxSayHiPerDay: number;
  // Auth actions
  loginWithEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (code: string) => Promise<boolean>;
  logout: () => void;
  // Onboarding actions
  updateProfile: (data: Partial<Profile>) => void;
  setUserInterests: (interests: UserInterest[]) => void;
  setUserPurposes: (purposes: CampusPurpose[]) => void;
  completeOnboarding: () => void;
  // Discover & Connections
  getRecommendations: (options?: {
    filterPurpose?: string;
    filterYear?: number;
    filterBranch?: string;
    searchQuery?: string;
  }) => CandidateCard[];
  sendConnectionRequest: (
    receiverId: string,
    message: string
  ) => { success: boolean; error?: string };
  respondToRequest: (
    requestId: string,
    status: "accepted" | "declined"
  ) => void;
  // Safety
  blockUser: (targetUserId: string) => void;
  reportUser: (targetUserId: string, reason: string, details?: string) => void;
  // Privacy & DPDP
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  exportUserData: () => string;
  deleteAccount: () => void;
  // Campus Extras
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  rsvpEvent: (eventId: string) => void;
  // Admin actions
  suspendUser: (userId: string) => void;
  restoreUser: (userId: string) => void;
  resolveReport: (reportId: string, action: "actioned" | "dismissed") => void;
  // Dev switch
  switchActiveUser: (userId: string) => void;
}

const DEFAULT_PRIVACY: PrivacySettings = {
  user_id: "",
  show_gender: "everyone",
  allow_requests_from: "everyone",
  is_profile_hidden: false,
  reveal_email_to_connections: true,
  reveal_phone_to_connections: true,
};

const INITIAL_GROUPS: CampusGroup[] = [
  {
    id: "grp_1",
    name: "Hackathon & Builder Hub",
    description: "Forming sprint squads for Smart India Hackathon, MLH, and campus dev challenges.",
    category: "Coding & Tech",
    member_count: 34,
    banner_color: "#5b3fe0",
    created_by: "u_aarav_01",
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    is_member: true,
  },
  {
    id: "grp_2",
    name: "Badminton Evening Regulars",
    description: "Daily indoor court doubles & singles. All skill levels welcome, just bring your racket!",
    category: "Sports & Fitness",
    member_count: 22,
    banner_color: "#0d9488",
    created_by: "u_rohan_03",
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "grp_3",
    name: "Indie Music & Acoustic Jam",
    description: "Sunset acoustic jams on hostel lawns, music production tips, and concert buddy finding.",
    category: "Music",
    member_count: 28,
    banner_color: "#8b5cf6",
    created_by: "u_ananya_02",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    is_member: true,
  },
  {
    id: "grp_4",
    name: "Campus Startup Syndicate",
    description: "Brainstorming MVP ideas, landing early users, and learning venture building together.",
    category: "Startups & Business",
    member_count: 19,
    banner_color: "#f59e0b",
    created_by: "u_kabir_05",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: "evt_1",
    title: "All-Night 24hr Campus Hackathon 2026",
    description: "Annual hackathon in the Innovation Lab. Find teammates, build prototypes, pitch to founders.",
    location: "Block 34, Innovation Hub",
    event_date: new Date(Date.now() + 5 * 86400000).toISOString(),
    category: "Coding & Tech",
    rsvp_count: 42,
    created_by: "u_aarav_01",
    created_at: new Date().toISOString(),
    has_rsvped: true,
  },
  {
    id: "evt_2",
    title: "Sunset Acoustic Open Mic & Chai",
    description: "Chill music evening on Open Air Amphitheatre steps. Bring your voice, guitar or just enjoy.",
    location: "Campus Amphitheatre",
    event_date: new Date(Date.now() + 2 * 86400000).toISOString(),
    category: "Music",
    rsvp_count: 67,
    created_by: "u_ananya_02",
    created_at: new Date().toISOString(),
  },
  {
    id: "evt_3",
    title: "Inter-Hostel Badminton Tournament",
    description: "Friendly knockout tournament. Register as a pair or find a partner right here.",
    location: "University Sports Complex",
    event_date: new Date(Date.now() + 7 * 86400000).toISOString(),
    category: "Sports & Fitness",
    rsvp_count: 31,
    created_by: "u_rohan_03",
    created_at: new Date().toISOString(),
  },
];

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export function CampusProvider({ children }: { children: React.ReactNode }) {
  // Candidate pool & seed store
  const [candidates, setCandidates] = useState<SeedStudent[]>(SEED_STUDENTS);

  // Active current user profile
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    // Default to Aarav Sharma for immediate demo experience
    return SEED_STUDENTS[0].profile;
  });

  const [userInterests, setUserInterestsState] = useState<UserInterest[]>(() => {
    return SEED_STUDENTS[0].interests;
  });

  const [userPurposes, setUserPurposesState] = useState<CampusPurpose[]>(() => {
    return SEED_STUDENTS[0].purposes;
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(() => ({
    ...DEFAULT_PRIVACY,
    user_id: SEED_STUDENTS[0].profile.id,
  }));

  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([
    {
      id: "req_demo_1",
      sender_id: "u_ananya_02",
      receiver_id: "u_aarav_01",
      message: "Hey Aarav! Loved your open-source work. Would love to collaborate on a hackathon project design!",
      status: "pending",
      created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      sender_profile: SEED_STUDENTS[1].profile,
      receiver_profile: SEED_STUDENTS[0].profile,
    },
    {
      id: "req_demo_2",
      sender_id: "u_aarav_01",
      receiver_id: "u_sneha_04",
      message: "Hey Sneha! Saw you like CTFs and cybersec. Let's do some study sessions for network security.",
      status: "accepted",
      created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
      sender_profile: SEED_STUDENTS[0].profile,
      receiver_profile: SEED_STUDENTS[3].profile,
    },
  ]);

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [campusGroups, setCampusGroups] = useState<CampusGroup[]>(INITIAL_GROUPS);
  const [campusEvents, setCampusEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [sayHiCountToday, setSayHiCountToday] = useState<number>(1);
  const maxSayHiPerDay = 20;

  // Persistence to local storage for realistic browser experience
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("vibe_check_current_user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setCurrentUser(parsed);
        } catch {
          // ignore error
        }
      }
    }
  }, []);

  const loginWithEmail = async (email: string) => {
    // Check if user already exists in seeds
    const existing = candidates.find(
      (c) => c.profile.email.toLowerCase() === email.toLowerCase()
    );

    if (existing) {
      setCurrentUser(existing.profile);
      setUserInterestsState(existing.interests);
      setUserPurposesState(existing.purposes);
      localStorage.setItem("vibe_check_current_user", JSON.stringify(existing.profile));
      return { success: true, message: "Welcome back! Verification OTP sent." };
    }

    // New user initial profile
    const newProfile: Profile = {
      id: "u_" + Math.random().toString(36).substring(2, 9),
      email,
      full_name: "",
      age: 18,
      gender: "Prefer not to say",
      phone: null,
      course: "B.Tech Computer Science & Engineering",
      branch: "CSE",
      year: 1,
      hostel_or_day: "Hostel",
      avatar_url: null,
      bio: "",
      languages: ["English", "Hindi"],
      availability: ["Weekday Evenings"],
      onboarding_step: 1,
      is_suspended: false,
      is_admin: email.includes("admin"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCurrentUser(newProfile);
    setUserInterestsState([]);
    setUserPurposesState(["Friends"]);
    localStorage.setItem("vibe_check_current_user", JSON.stringify(newProfile));
    return { success: true, message: "Verification code sent to your student email." };
  };

  const verifyOtp = async (code: string) => {
    // 6-digit OTP check (accepts any valid 6-digit number in demo, default '123456')
    return code.length === 6 && /^\d+$/.test(code);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("vibe_check_current_user");
  };

  const updateProfile = (data: Partial<Profile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data, updated_at: new Date().toISOString() };
    setCurrentUser(updated);
    localStorage.setItem("vibe_check_current_user", JSON.stringify(updated));

    // Update in candidates list if present
    setCandidates((prev) =>
      prev.map((c) => (c.profile.id === updated.id ? { ...c, profile: updated } : c))
    );
  };

  const setUserInterests = (interests: UserInterest[]) => {
    setUserInterestsState(interests);
  };

  const setUserPurposes = (purposes: CampusPurpose[]) => {
    setUserPurposesState(purposes);
  };

  const completeOnboarding = () => {
    if (!currentUser) return;
    updateProfile({ onboarding_step: 4 });
  };

  const getRecommendations = (options?: {
    filterPurpose?: string;
    filterYear?: number;
    filterBranch?: string;
    searchQuery?: string;
  }): CandidateCard[] => {
    if (!currentUser) return [];

    const activeUserContext: UserMatchingProfile = {
      profile: currentUser,
      interests: userInterests,
      purposes: userPurposes,
    };

    const blockedUserIds = new Set(
      blocks.map((b) => (b.blocker_id === currentUser.id ? b.blocked_id : b.blocker_id))
    );

    const candidateProfiles: CandidateMatchingProfile[] = candidates
      .filter((c) => c.profile.id !== currentUser.id && !blockedUserIds.has(c.profile.id))
      .map((c) => {
        // Find existing connection status
        const rel = connectionRequests.find(
          (r) =>
            (r.sender_id === currentUser.id && r.receiver_id === c.profile.id) ||
            (r.sender_id === c.profile.id && r.receiver_id === currentUser.id)
        );
        return {
          profile: c.profile,
          interests: c.interests,
          purposes: c.purposes,
          connection_status: rel ? rel.status : "none",
        };
      });

    return rankCandidates(activeUserContext, candidateProfiles, options);
  };

  const sendConnectionRequest = (receiverId: string, message: string) => {
    if (!currentUser) return { success: false, error: "Please log in first" };

    // Rate limit check
    if (sayHiCountToday >= maxSayHiPerDay) {
      return {
        success: false,
        error: `Daily limit reached! You can send up to ${maxSayHiPerDay} connection requests per day to protect student safety.`,
      };
    }

    // Check if already sent
    const existing = connectionRequests.find(
      (r) =>
        (r.sender_id === currentUser.id && r.receiver_id === receiverId) ||
        (r.sender_id === receiverId && r.receiver_id === currentUser.id)
    );

    if (existing) {
      return {
        success: false,
        error: `A connection request between you two already exists (Status: ${existing.status}).`,
      };
    }

    const receiverCandidate = candidates.find((c) => c.profile.id === receiverId);

    const newReq: ConnectionRequest = {
      id: "req_" + Math.random().toString(36).substring(2, 9),
      sender_id: currentUser.id,
      receiver_id: receiverId,
      message: message.trim() || "Hey! Would love to connect on campus.",
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sender_profile: currentUser,
      receiver_profile: receiverCandidate?.profile,
    };

    setConnectionRequests((prev) => [newReq, ...prev]);
    setSayHiCountToday((prev) => prev + 1);

    return { success: true };
  };

  const respondToRequest = (requestId: string, status: "accepted" | "declined") => {
    setConnectionRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status, updated_at: new Date().toISOString() }
          : r
      )
    );
  };

  const blockUser = (targetUserId: string) => {
    if (!currentUser) return;
    const newBlock: Block = {
      id: "blk_" + Math.random().toString(36).substring(2, 9),
      blocker_id: currentUser.id,
      blocked_id: targetUserId,
      created_at: new Date().toISOString(),
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const reportUser = (targetUserId: string, reason: string, details?: string) => {
    if (!currentUser) return;
    const targetCandidate = candidates.find((c) => c.profile.id === targetUserId);
    const newReport: Report = {
      id: "rep_" + Math.random().toString(36).substring(2, 9),
      reporter_id: currentUser.id,
      reported_id: targetUserId,
      reason,
      details,
      status: "pending",
      created_at: new Date().toISOString(),
      reporter: currentUser,
      reported: targetCandidate?.profile,
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const updatePrivacySettings = (settings: Partial<PrivacySettings>) => {
    setPrivacySettings((prev) => ({ ...prev, ...settings }));
  };

  const exportUserData = () => {
    const data = {
      profile: currentUser,
      interests: userInterests,
      purposes: userPurposes,
      privacySettings,
      sentRequests: connectionRequests.filter((r) => r.sender_id === currentUser?.id),
      receivedRequests: connectionRequests.filter((r) => r.receiver_id === currentUser?.id),
      exportedAt: new Date().toISOString(),
      notice: "In compliance with Digital Personal Data Protection (DPDP) Act 2023.",
    };
    return JSON.stringify(data, null, 2);
  };

  const deleteAccount = () => {
    if (!currentUser) return;
    // Remove all associated records
    setCandidates((prev) => prev.filter((c) => c.profile.id !== currentUser.id));
    setConnectionRequests((prev) =>
      prev.filter(
        (r) => r.sender_id !== currentUser.id && r.receiver_id !== currentUser.id
      )
    );
    logout();
  };

  const joinGroup = (groupId: string) => {
    setCampusGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, member_count: g.member_count + 1, is_member: true }
          : g
      )
    );
  };

  const leaveGroup = (groupId: string) => {
    setCampusGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, member_count: Math.max(1, g.member_count - 1), is_member: false }
          : g
      )
    );
  };

  const rsvpEvent = (eventId: string) => {
    setCampusEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              rsvp_count: e.has_rsvped ? e.rsvp_count - 1 : e.rsvp_count + 1,
              has_rsvped: !e.has_rsvped,
            }
          : e
      )
    );
  };

  const suspendUser = (userId: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.profile.id === userId
          ? { ...c, profile: { ...c.profile, is_suspended: true } }
          : c
      )
    );
  };

  const restoreUser = (userId: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.profile.id === userId
          ? { ...c, profile: { ...c.profile, is_suspended: false } }
          : c
      )
    );
  };

  const resolveReport = (reportId: string, action: "actioned" | "dismissed") => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
  };

  const switchActiveUser = (userId: string) => {
    const student = SEED_STUDENTS.find((s) => s.profile.id === userId);
    if (student) {
      setCurrentUser(student.profile);
      setUserInterestsState(student.interests);
      setUserPurposesState(student.purposes);
      localStorage.setItem("vibe_check_current_user", JSON.stringify(student.profile));
    }
  };

  return (
    <CampusContext.Provider
      value={{
        currentUser,
        userInterests,
        userPurposes,
        privacySettings,
        connectionRequests,
        blocks,
        reports,
        campusGroups,
        campusEvents,
        sayHiCountToday,
        maxSayHiPerDay,
        loginWithEmail,
        verifyOtp,
        logout,
        updateProfile,
        setUserInterests,
        setUserPurposes,
        completeOnboarding,
        getRecommendations,
        sendConnectionRequest,
        respondToRequest,
        blockUser,
        reportUser,
        updatePrivacySettings,
        exportUserData,
        deleteAccount,
        joinGroup,
        leaveGroup,
        rsvpEvent,
        suspendUser,
        restoreUser,
        resolveReport,
        switchActiveUser,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error("useCampus must be used within a CampusProvider");
  }
  return context;
}

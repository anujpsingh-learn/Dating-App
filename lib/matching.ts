import { Profile, UserInterest, CampusPurpose, CandidateCard, ConnectionStatus } from "@/types/database";
import { MASTER_INTERESTS } from "./interests-data";

export interface UserMatchingProfile {
  profile: Profile;
  interests: UserInterest[];
  purposes: CampusPurpose[];
}

export interface CandidateMatchingProfile {
  profile: Profile;
  interests: UserInterest[];
  purposes: CampusPurpose[];
  connection_status?: ConnectionStatus | 'none';
}

/**
 * Calculates Vibe Match between the active user and a candidate student.
 * 
 * Rules:
 * 1. Candidate MUST share at least one purpose with active user. If 0 shared purposes -> null (filtered out).
 * 2. Base score from shared likes (+10 points each).
 * 3. User's top 3 interests count double (+20 points instead of +10 if user or candidate has marked it as top).
 * 4. Subtract a penalty (-15 points) when candidate's likes overlap with user's dislikes (or vice versa).
 * 5. Bonus for overlapping purposes (+8 points each).
 * 6. Bonus for same branch (+6 points) and same year (+5 points).
 * 7. Bonus for same residency type (+3 points).
 * 8. Normalized to percentage and capped at 97% (minimum 20%).
 */
export function calculateVibeMatch(
  currentUser: UserMatchingProfile,
  candidate: CandidateMatchingProfile
): {
  vibeScore: number;
  sharedLikes: string[];
  topSharedLikes: string[];
  conflictCount: number;
  sharedPurposes: CampusPurpose[];
  isEligible: boolean;
} {
  // Rule 1: Purpose overlap requirement
  const sharedPurposes = currentUser.purposes.filter((p) =>
    candidate.purposes.includes(p)
  );

  if (sharedPurposes.length === 0) {
    return {
      vibeScore: 0,
      sharedLikes: [],
      topSharedLikes: [],
      conflictCount: 0,
      sharedPurposes: [],
      isEligible: false,
    };
  }

  // Pre-index user interests
  const userLikes = new Set<string>();
  const userTopLikes = new Set<string>();
  const userDislikes = new Set<string>();

  currentUser.interests.forEach((item) => {
    if (item.type === "like") {
      userLikes.add(item.interest_id);
      if (item.is_top) userTopLikes.add(item.interest_id);
    } else if (item.type === "dislike") {
      userDislikes.add(item.interest_id);
    }
  });

  // Pre-index candidate interests
  const candidateLikes = new Set<string>();
  const candidateTopLikes = new Set<string>();
  const candidateDislikes = new Set<string>();

  candidate.interests.forEach((item) => {
    if (item.type === "like") {
      candidateLikes.add(item.interest_id);
      if (item.is_top) candidateTopLikes.add(item.interest_id);
    } else if (item.type === "dislike") {
      candidateDislikes.add(item.interest_id);
    }
  });

  const interestNameMap = new Map<string, string>();
  MASTER_INTERESTS.forEach((i) => interestNameMap.set(i.id, i.name));

  let score = 0;
  const sharedLikesNames: string[] = [];
  const topSharedLikesNames: string[] = [];
  let conflictCount = 0;

  // 1. Shared likes calculation & top 3 multiplier
  candidateLikes.forEach((interestId) => {
    if (userLikes.has(interestId)) {
      const isUserTop = userTopLikes.has(interestId);
      const isCandTop = candidateTopLikes.has(interestId);
      const name = interestNameMap.get(interestId) || interestId;

      if (isUserTop || isCandTop) {
        score += 20; // Top 3 counts double
        topSharedLikesNames.push(name);
      } else {
        score += 10;
      }
      sharedLikesNames.push(name);
    }
  });

  // 2. Dislike conflict penalty
  // If candidate likes what user dislikes
  candidateLikes.forEach((interestId) => {
    if (userDislikes.has(interestId)) {
      score -= 15;
      conflictCount += 1;
    }
  });

  // If user likes what candidate dislikes
  userLikes.forEach((interestId) => {
    if (candidateDislikes.has(interestId)) {
      score -= 15;
      conflictCount += 1;
    }
  });

  // 3. Overlapping purposes bonus
  score += sharedPurposes.length * 8;

  // 4. Same branch bonus
  if (
    currentUser.profile.branch &&
    candidate.profile.branch &&
    currentUser.profile.branch.toLowerCase().trim() ===
      candidate.profile.branch.toLowerCase().trim()
  ) {
    score += 6;
  }

  // 5. Same year bonus
  if (currentUser.profile.year === candidate.profile.year) {
    score += 5;
  }

  // 6. Same residence routine bonus
  if (currentUser.profile.hostel_or_day === candidate.profile.hostel_or_day) {
    score += 3;
  }

  // Normalization logic:
  // Baseline score around 40 pts should yield ~65%
  // 70+ pts yields 85-97%
  // Score formula: 35 + (score * 0.72)
  let normalizedScore = Math.round(30 + score * 0.75);

  // If there are zero shared likes, penalize heavily
  if (sharedLikesNames.length === 0) {
    normalizedScore = Math.min(normalizedScore, 42);
  }

  // Clamp: minimum 20%, maximum 97% (never 100% to keep it real)
  const vibeScore = Math.max(20, Math.min(97, normalizedScore));

  return {
    vibeScore,
    sharedLikes: sharedLikesNames,
    topSharedLikes: topSharedLikesNames,
    conflictCount,
    sharedPurposes,
    isEligible: true,
  };
}

/**
 * Ranks and transforms candidate profiles into presentation cards
 */
export function rankCandidates(
  currentUser: UserMatchingProfile,
  candidates: CandidateMatchingProfile[],
  options?: {
    filterPurpose?: string;
    filterYear?: number;
    filterBranch?: string;
    searchQuery?: string;
  }
): CandidateCard[] {
  const cards: CandidateCard[] = [];

  for (const candidate of candidates) {
    // Exclude self
    if (candidate.profile.id === currentUser.profile.id) continue;
    // Exclude suspended or hidden profiles
    if (candidate.profile.is_suspended) continue;

    // Filters
    if (options?.filterPurpose && options.filterPurpose !== "all") {
      if (!candidate.purposes.includes(options.filterPurpose as CampusPurpose)) {
        continue;
      }
    }

    if (options?.filterYear && options.filterYear !== 0) {
      if (candidate.profile.year !== options.filterYear) {
        continue;
      }
    }

    if (options?.filterBranch && options.filterBranch !== "all") {
      if (
        !candidate.profile.branch
          .toLowerCase()
          .includes(options.filterBranch.toLowerCase())
      ) {
        continue;
      }
    }

    if (options?.searchQuery && options.searchQuery.trim().length > 0) {
      const q = options.searchQuery.toLowerCase();
      const matchName = candidate.profile.full_name.toLowerCase().includes(q);
      const matchBio = candidate.profile.bio.toLowerCase().includes(q);
      const matchBranch = candidate.profile.branch.toLowerCase().includes(q);
      if (!matchName && !matchBio && !matchBranch) {
        continue;
      }
    }

    const match = calculateVibeMatch(currentUser, candidate);
    if (!match.isEligible) continue;

    cards.push({
      profile: candidate.profile,
      vibe_score: match.vibeScore,
      shared_likes: match.sharedLikes,
      top_shared_likes: match.topSharedLikes,
      conflict_count: match.conflictCount,
      shared_purposes: match.sharedPurposes,
      connection_status: candidate.connection_status || 'none',
    });
  }

  // Sort descending by vibe score
  return cards.sort((a, b) => b.vibe_score - a.vibe_score);
}

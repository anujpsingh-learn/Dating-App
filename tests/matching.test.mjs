import test from "node:test";
import assert from "node:assert/strict";

// Re-implement the pure algorithm logic in test to test deterministic weights
function calculateMatchTest(currentUser, candidate) {
  const sharedPurposes = currentUser.purposes.filter((p) =>
    candidate.purposes.includes(p)
  );

  if (sharedPurposes.length === 0) {
    return {
      vibeScore: 0,
      sharedLikes: [],
      conflictCount: 0,
      isEligible: false,
    };
  }

  const userLikes = new Set(currentUser.interests.filter(i => i.type === 'like').map(i => i.id));
  const userTop = new Set(currentUser.interests.filter(i => i.type === 'like' && i.isTop).map(i => i.id));
  const userDislikes = new Set(currentUser.interests.filter(i => i.type === 'dislike').map(i => i.id));

  const candLikes = new Set(candidate.interests.filter(i => i.type === 'like').map(i => i.id));
  const candTop = new Set(candidate.interests.filter(i => i.type === 'like' && i.isTop).map(i => i.id));
  const candDislikes = new Set(candidate.interests.filter(i => i.type === 'dislike').map(i => i.id));

  let score = 0;
  const shared = [];
  let conflicts = 0;

  candLikes.forEach(id => {
    if (userLikes.has(id)) {
      if (userTop.has(id) || candTop.has(id)) {
        score += 20; // Top 3 counts double
      } else {
        score += 10;
      }
      shared.push(id);
    }
  });

  candLikes.forEach(id => {
    if (userDislikes.has(id)) {
      score -= 15;
      conflicts += 1;
    }
  });

  userLikes.forEach(id => {
    if (candDislikes.has(id)) {
      score -= 15;
      conflicts += 1;
    }
  });

  score += sharedPurposes.length * 8;

  if (currentUser.branch && candidate.branch && currentUser.branch === candidate.branch) {
    score += 6;
  }
  if (currentUser.year === candidate.year) {
    score += 5;
  }

  let normalized = Math.round(30 + score * 0.75);
  if (shared.length === 0) {
    normalized = Math.min(normalized, 42);
  }

  const vibeScore = Math.max(20, Math.min(97, normalized));

  return {
    vibeScore,
    sharedLikes: shared,
    conflictCount: conflicts,
    isEligible: true,
  };
}

test("Matching Engine: Excludes candidates with 0 shared purposes", () => {
  const user = {
    branch: "CSE",
    year: 3,
    purposes: ["Study Partners"],
    interests: [{ id: "tech_ai", type: "like", isTop: true }],
  };
  const cand = {
    branch: "CSE",
    year: 3,
    purposes: ["Sports & Hobbies"], // No overlap
    interests: [{ id: "tech_ai", type: "like", isTop: true }],
  };

  const res = calculateMatchTest(user, cand);
  assert.equal(res.isEligible, false);
  assert.equal(res.vibeScore, 0);
});

test("Matching Engine: Boosts Top 3 interests with double score", () => {
  const user = {
    branch: "CSE",
    year: 2,
    purposes: ["Friends"],
    interests: [
      { id: "tech_ai", type: "like", isTop: true },
      { id: "music_indie", type: "like", isTop: false },
    ],
  };

  const candWithTop = {
    branch: "ECE",
    year: 2,
    purposes: ["Friends"],
    interests: [{ id: "tech_ai", type: "like", isTop: false }],
  };

  const candWithoutTop = {
    branch: "ECE",
    year: 2,
    purposes: ["Friends"],
    interests: [{ id: "music_indie", type: "like", isTop: false }],
  };

  const resTop = calculateMatchTest(user, candWithTop);
  const resNormal = calculateMatchTest(user, candWithoutTop);

  assert.ok(resTop.vibeScore > resNormal.vibeScore, "Top 3 match must score higher than normal match");
});

test("Matching Engine: Penalizes dislike conflict", () => {
  const user = {
    branch: "CSE",
    year: 3,
    purposes: ["Friends"],
    interests: [
      { id: "tech_ai", type: "like", isTop: false },
      { id: "gaming_valorant", type: "dislike", isTop: false },
    ],
  };

  const candFriendly = {
    branch: "CSE",
    year: 3,
    purposes: ["Friends"],
    interests: [{ id: "tech_ai", type: "like", isTop: false }],
  };

  const candConflicted = {
    branch: "CSE",
    year: 3,
    purposes: ["Friends"],
    interests: [
      { id: "tech_ai", type: "like", isTop: false },
      { id: "gaming_valorant", type: "like", isTop: false }, // Conflict!
    ],
  };

  const resFriendly = calculateMatchTest(user, candFriendly);
  const resConflicted = calculateMatchTest(user, candConflicted);

  assert.equal(resConflicted.conflictCount, 1);
  assert.ok(resConflicted.vibeScore < resFriendly.vibeScore, "Conflicted pair must score lower");
});

test("Matching Engine: Clamps score strictly to 97% maximum", () => {
  const user = {
    branch: "CSE",
    year: 3,
    purposes: ["Friends", "Study Partners", "Project Teammates", "Sports & Hobbies"],
    interests: [
      { id: "i1", type: "like", isTop: true },
      { id: "i2", type: "like", isTop: true },
      { id: "i3", type: "like", isTop: true },
      { id: "i4", type: "like", isTop: false },
      { id: "i5", type: "like", isTop: false },
    ],
  };

  const candSuperMatch = {
    branch: "CSE",
    year: 3,
    purposes: ["Friends", "Study Partners", "Project Teammates", "Sports & Hobbies"],
    interests: [
      { id: "i1", type: "like", isTop: true },
      { id: "i2", type: "like", isTop: true },
      { id: "i3", type: "like", isTop: true },
      { id: "i4", type: "like", isTop: false },
      { id: "i5", type: "like", isTop: false },
    ],
  };

  const res = calculateMatchTest(user, candSuperMatch);
  assert.equal(res.vibeScore, 97, "Vibe score must be capped at 97% for authenticity");
});

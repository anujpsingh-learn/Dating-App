# ⚡ Vibe Check

> **University Student Connection Platform**  
> *Find your people on campus. Connect for study partners, hackathons, sports & hobbies, campus events, and genuine friendships based on shared vibes.*  
> **Strictly NOT a dating app: no swipe cards, no hearts, no romantic matching metaphors.**

---

## 🌟 Visual & Product Identity
- **Primary Accent**: Violet (`#5b3fe0`)
- **Secondary Accent**: Teal (`#0d9488` / `#14b8a6`)
- **Typography**: Bricolage Grotesque (Google Font with clean fallback stack)
- **UI Elements**: Rounded cards (`rounded-2xl`, `rounded-3xl`), interactive interest chips, the signature **Vibe Meter** progress bar with dynamic percentage scoring.
- **Theme**: Full Dark and Light mode support via `next-themes`.

---

## 🚀 Tech Stack
- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui style components
- **Animations**: Framer Motion for subtle transitions and interactive chip feedback
- **Backend**: Supabase (Postgres, Auth with OTP, Row Level Security, Realtime, Storage)
- **Form & Validation**: React Hook Form, `@hookform/resolvers/zod`, Zod
- **Target Deployment**: Vercel

---

## 🔑 Key Features

### 1. Landing Page (`/`)
- Hero with a **live interactive chip demo** and dynamic **Vibe Meter** simulator.
- 3-step "How It Works" guide.
- Safety & privacy guarantee section (DPDP Act 2023 compliant).
- FAQ accordion and allowed university email domains.

### 2. University Email Authentication (`/auth/login`, `/auth/verify`)
- Sign up & log in with official university email only using a 6-digit OTP.
- Enforces `ALLOWED_EMAIL_DOMAINS` (e.g. `lpu.in, thapar.edu, iitd.ac.in, campus.edu`).
- Clear, friendly error rejection if a non-university email (like `@gmail.com`) is entered.
- DPDP Act 2023 statutory consent checkbox.

### 3. 3-Step Onboarding Wizard (`/onboarding`)
- **Step 1 (About You)**: Full name, 18+ age verification, gender (includes *Prefer not to say*), phone number, course, branch, academic year (1-5), hostel or day scholar, avatar, and 150-char bio.
- **Step 2 (Interests)**: Categorized pill chips (12 categories, 100+ interests), likes, dislikes, top 3 selector (which count double in matching), and custom free-text chip input.
- **Step 3 (Goals & Availability)**: Campus purposes (Friends, Study Partners, Project Teammates, Sports & Hobbies, Event Buddies), availability windows, and languages spoken.
- Progress bar + auto-save on each step so users can leave and resume seamlessly.

### 4. Discover Grid (`/discover`)
- Grid of candidate peer cards (no swipe stack, respectful peer cards).
- Shows student name, branch, academic year, 150-char bio, and dynamic **Vibe Meter** percentage.
- **Shared Interest Highlights**: "You both like: X, Y, Z".
- Filters: Campus purpose, academic year, branch, and keyword search.
- "Say Hi" button opening the personalized intro note modal.

### 5. Connections & Safe Contact Reveal (`/connections`)
- **"Say Hi" Request**: Sends a personalized intro message (max 200 characters) with a safety rate limit of 20 requests per day.
- **Incoming & Sent Requests**: Accept or decline incoming invitations.
- **Safe Contact Reveal**: Phone and email are **strictly hidden** until **both** students mutually accept, and only if allowed by privacy settings.
- First-connection safety guidelines reminder (*"Meet in public campus spots, tell a friend"*).

### 6. Privacy & Settings (`/settings`, `/profile`)
- Privacy controls: Who can see gender, who can send requests, and temporarily pause/hide profile from recommendations.
- **DPDP Act 2023 Rights**: One-click download of all personal data (JSON export) and permanent account deletion.

### 7. Safety, Moderation & Admin Dashboard (`/admin`, `/safety`)
- Universal Report & Block modal on every profile and connection card.
- Blocked users disappear immediately and permanently from each other's recommendations.
- Role-protected Admin Dashboard for reviewing reports, suspending/restoring accounts, and monitoring campus health metrics.

### 8. Campus Extras (`/campus/groups`, `/campus/events`)
- Campus interest groups (Builder Hub, Badminton Regulars, Indie Jam, Startup Syndicate) with join/leave functionality.
- Campus events board with RSVP counters and event buddy matching.

---

## 🧮 Matching Algorithm Logic (`lib/matching.ts` / Migration 004)
1. **Purpose Filter**: Candidates must share at least 1 campus purpose (e.g. both seeking "Study Partners"). If 0 shared purposes, candidate is excluded.
2. **Shared Likes (+10 pts)**: Each overlapping interest adds points.
3. **Top 3 Double-Weight (+20 pts)**: If an interest is marked as one of the user's top 3, it counts double.
4. **Dislike Conflict Penalty (-15 pts)**: If a candidate likes what the user dislikes, a conflict penalty is subtracted.
5. **Synergy Boosts**: Overlapping purposes (+8 pts each), same course/branch (+6 pts), same academic year (+5 pts), same residence routine (+3 pts).
6. **Normalization**: Formula normalized between 20% and strictly clamped at **97%** to maintain authenticity.

---

## 🛠️ Local Setup & Getting Started

### 1. Clone & Install
```bash
git clone <repository-url>
cd "Dating App"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your allowed email domains and Supabase credentials:
```env
ALLOWED_EMAIL_DOMAINS=lpu.in,thapar.edu,iitd.ac.in,campus.edu
NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS=lpu.in,thapar.edu,iitd.ac.in,campus.edu
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
MAX_SAY_HI_PER_DAY=20
```

> **Note**: In development or demo mode, Vibe Check includes a rich seed store (`lib/seed-data.ts`) with 8 realistic university student profiles across diverse branches, allowing full exploration, matching, and dual-perspective testing out of the box!

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Tests
```bash
npm test
```

---

## 🗄️ Supabase Database Setup & Migrations
The database schema and Row Level Security policies are organized into 4 modular migration scripts located in `supabase/migrations/`:

1. `001_initial_schema.sql`: Profiles, interests, user_interests, user_purposes, connection_requests, privacy_settings, blocks, reports, groups, and events.
2. `002_rls_policies.sql`: Row Level Security policies, block isolation, and safe contact reveal function (`get_connection_contact`).
3. `003_seed_interests.sql`: 100+ categorized campus interests with icons.
4. `004_matching_function.sql`: Postgres function `get_recommended_peers` for server-side score calculation.

To apply migrations in your Supabase project:
- Open your Supabase Dashboard -> **SQL Editor**.
- Run each file in numerical order (`001` -> `002` -> `003` -> `004`).

---

## 🛡️ Security, Privacy & Compliance (DPDP Act 2023)
- **Data Minimization**: Only collects data required for university peer matching.
- **No Contact Exposure**: Phone numbers and emails are never returned in public queries.
- **Rate Limiting**: Daily limit of 20 requests per student to stop harassment and spam.
- **Permanent Erasure**: Instant one-click account deletion and data export in JSON format.
- **Zero Advertising Trackers**: No third-party behavioral ads or marketing pixels.

---

## 🚢 Deploying to Vercel
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables (`ALLOWED_EMAIL_DOMAINS`, `NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Click **Deploy**!

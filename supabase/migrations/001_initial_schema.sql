-- ====================================================================
-- VIBE CHECK: Migration 001 - Initial Schema
-- ====================================================================

-- 1. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18),
    gender TEXT NOT NULL DEFAULT 'Prefer not to say' CHECK (gender IN ('Male', 'Female', 'Non-binary', 'Prefer not to say')),
    phone TEXT,
    course TEXT NOT NULL,
    branch TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1 AND year <= 5),
    hostel_or_day TEXT NOT NULL DEFAULT 'Hostel' CHECK (hostel_or_day IN ('Hostel', 'Day Scholar')),
    avatar_url TEXT,
    bio VARCHAR(150) NOT NULL DEFAULT '',
    languages TEXT[] DEFAULT '{}',
    availability TEXT[] DEFAULT '{}',
    onboarding_step INTEGER NOT NULL DEFAULT 1 CHECK (onboarding_step >= 1 AND onboarding_step <= 4),
    is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Interests Master Table
CREATE TABLE IF NOT EXISTS public.interests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL
);

-- 3. User Interests Table
CREATE TABLE IF NOT EXISTS public.user_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    interest_id TEXT NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('like', 'dislike')),
    is_top BOOLEAN NOT NULL DEFAULT FALSE,
    custom_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_interest UNIQUE (user_id, interest_id)
);

-- 4. User Purposes Table
CREATE TABLE IF NOT EXISTS public.user_purposes (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    purpose TEXT NOT NULL CHECK (purpose IN ('Friends', 'Study Partners', 'Project Teammates', 'Sports & Hobbies', 'Event Buddies')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, purpose)
);

-- 5. Connection Requests Table
CREATE TABLE IF NOT EXISTS public.connection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message VARCHAR(200) NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_sender_receiver UNIQUE (sender_id, receiver_id),
    CONSTRAINT chk_not_self_request CHECK (sender_id <> receiver_id)
);

-- 6. Privacy Settings Table
CREATE TABLE IF NOT EXISTS public.privacy_settings (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    show_gender TEXT NOT NULL DEFAULT 'everyone' CHECK (show_gender IN ('everyone', 'connections_only', 'nobody')),
    allow_requests_from TEXT NOT NULL DEFAULT 'everyone' CHECK (allow_requests_from IN ('everyone', 'same_branch_or_year', 'nobody')),
    is_profile_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    reveal_email_to_connections BOOLEAN NOT NULL DEFAULT TRUE,
    reveal_phone_to_connections BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Safety: Blocks Table
CREATE TABLE IF NOT EXISTS public.blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_blocker_blocked UNIQUE (blocker_id, blocked_id),
    CONSTRAINT chk_not_self_block CHECK (blocker_id <> blocked_id)
);

-- 8. Safety: Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned', 'dismissed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Campus Groups & Members
CREATE TABLE IF NOT EXISTS public.campus_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    banner_color TEXT NOT NULL DEFAULT '#5b3fe0',
    member_count INTEGER NOT NULL DEFAULT 1,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.group_members (
    group_id UUID NOT NULL REFERENCES public.campus_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (group_id, user_id)
);

-- 10. Campus Events & RSVPs
CREATE TABLE IF NOT EXISTS public.campus_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    category TEXT NOT NULL,
    rsvp_count INTEGER NOT NULL DEFAULT 0,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.event_rsvps (
    event_id UUID NOT NULL REFERENCES public.campus_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (event_id, user_id)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_course_branch ON public.profiles(course, branch);
CREATE INDEX IF NOT EXISTS idx_profiles_year ON public.profiles(year);
CREATE INDEX IF NOT EXISTS idx_user_interests_user ON public.user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_interest ON public.user_interests(interest_id);
CREATE INDEX IF NOT EXISTS idx_user_purposes_user ON public.user_purposes(user_id);
CREATE INDEX IF NOT EXISTS idx_conn_requests_users ON public.connection_requests(sender_id, receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_blocks_users ON public.blocks(blocker_id, blocked_id);

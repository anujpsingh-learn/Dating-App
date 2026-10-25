-- ====================================================================
-- VIBE CHECK: Migration 002 - Row Level Security (RLS)
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purposes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 1. Interests (Master Catalog)
-- Anyone authenticated can view the catalog
-- --------------------------------------------------------------------
CREATE POLICY "Anyone can view interests catalog"
    ON public.interests FOR SELECT
    TO authenticated
    USING (true);

-- --------------------------------------------------------------------
-- 2. Blocks
-- Users can see their own blocks, and insert/delete blocks they own
-- --------------------------------------------------------------------
CREATE POLICY "Users can view blocks they created"
    ON public.blocks FOR SELECT
    TO authenticated
    USING (auth.uid() = blocker_id);

CREATE POLICY "Users can create blocks"
    ON public.blocks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can delete blocks they created"
    ON public.blocks FOR DELETE
    TO authenticated
    USING (auth.uid() = blocker_id);

-- --------------------------------------------------------------------
-- Helper functions for checking block relations
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_blocked(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.blocks
        WHERE (blocker_id = auth.uid() AND blocked_id = target_user_id)
           OR (blocker_id = target_user_id AND blocked_id = auth.uid())
    );
$$;

-- Helper to check if two users have an accepted connection
CREATE OR REPLACE FUNCTION public.is_accepted_connection(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.connection_requests
        WHERE status = 'accepted'
          AND ((sender_id = auth.uid() AND receiver_id = target_user_id)
            OR (sender_id = target_user_id AND receiver_id = auth.uid()))
    );
$$;

-- --------------------------------------------------------------------
-- 3. Profiles
-- Self can view and update everything
-- Other users can view non-hidden, non-blocked profiles
-- --------------------------------------------------------------------
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can view non-hidden, non-blocked peers"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        auth.uid() != id
        AND is_suspended = FALSE
        AND NOT public.is_blocked(id)
        AND EXISTS (
            SELECT 1 FROM public.privacy_settings ps
            WHERE ps.user_id = profiles.id
              AND ps.is_profile_hidden = FALSE
        )
    );

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- --------------------------------------------------------------------
-- 4. Safe Contact Reveal View
-- Secure view or function that returns email and phone ONLY if accepted connection
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_connection_contact(peer_id UUID)
RETURNS TABLE (
    email TEXT,
    phone TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    can_reveal_email BOOLEAN := FALSE;
    can_reveal_phone BOOLEAN := FALSE;
    rec_email TEXT := NULL;
    rec_phone TEXT := NULL;
BEGIN
    -- Check if accepted mutual connection exists
    IF NOT public.is_accepted_connection(peer_id) THEN
        RETURN;
    END IF;

    -- Check privacy settings of peer
    SELECT reveal_email_to_connections, reveal_phone_to_connections
    INTO can_reveal_email, can_reveal_phone
    FROM public.privacy_settings
    WHERE user_id = peer_id;

    -- Fetch actual profile contact data
    SELECT p.email, p.phone
    INTO rec_email, rec_phone
    FROM public.profiles p
    WHERE p.id = peer_id;

    RETURN QUERY SELECT
        CASE WHEN can_reveal_email THEN rec_email ELSE NULL END,
        CASE WHEN can_reveal_phone THEN rec_phone ELSE NULL END;
END;
$$;

-- --------------------------------------------------------------------
-- 5. User Interests & Purposes
-- --------------------------------------------------------------------
CREATE POLICY "Users can manage their own interests"
    ON public.user_interests FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Peers can view interests of non-blocked users"
    ON public.user_interests FOR SELECT
    TO authenticated
    USING (NOT public.is_blocked(user_id));

CREATE POLICY "Users can manage their own purposes"
    ON public.user_purposes FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Peers can view purposes of non-blocked users"
    ON public.user_purposes FOR SELECT
    TO authenticated
    USING (NOT public.is_blocked(user_id));

-- --------------------------------------------------------------------
-- 6. Privacy Settings
-- --------------------------------------------------------------------
CREATE POLICY "Users can view and manage their own privacy settings"
    ON public.privacy_settings FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 7. Connection Requests
-- --------------------------------------------------------------------
CREATE POLICY "Users can view requests they sent or received"
    ON public.connection_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create connection requests"
    ON public.connection_requests FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = sender_id
        AND NOT public.is_blocked(receiver_id)
    );

CREATE POLICY "Receivers can update status of requests"
    ON public.connection_requests FOR UPDATE
    TO authenticated
    USING (auth.uid() = receiver_id)
    WITH CHECK (auth.uid() = receiver_id);

-- --------------------------------------------------------------------
-- 8. Reports
-- --------------------------------------------------------------------
CREATE POLICY "Users can submit reports"
    ON public.reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view and manage reports"
    ON public.reports FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- --------------------------------------------------------------------
-- 9. Campus Groups & Events
-- --------------------------------------------------------------------
CREATE POLICY "Anyone can view groups"
    ON public.campus_groups FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can create groups"
    ON public.campus_groups FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Anyone can view group members"
    ON public.group_members FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can join or leave groups"
    ON public.group_members FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view events"
    ON public.campus_events FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can create events"
    ON public.campus_events FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Anyone can view event RSVPs"
    ON public.event_rsvps FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can manage their own RSVPs"
    ON public.event_rsvps FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

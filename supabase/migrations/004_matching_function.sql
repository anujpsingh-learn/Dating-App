-- ====================================================================
-- VIBE CHECK: Migration 004 - Postgres Matching Function
-- ====================================================================

CREATE OR REPLACE FUNCTION public.get_recommended_peers(
    p_current_user_id UUID,
    p_filter_purpose TEXT DEFAULT NULL,
    p_filter_year INTEGER DEFAULT NULL,
    p_filter_branch TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    peer_id UUID,
    full_name TEXT,
    avatar_url TEXT,
    course TEXT,
    branch TEXT,
    year INTEGER,
    hostel_or_day TEXT,
    bio TEXT,
    languages TEXT[],
    availability TEXT[],
    vibe_score INTEGER,
    shared_likes TEXT[],
    top_shared_likes TEXT[],
    conflict_count INTEGER,
    shared_purposes TEXT[],
    connection_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    cur_profile RECORD;
    cur_user_likes TEXT[];
    cur_user_top_likes TEXT[];
    cur_user_dislikes TEXT[];
    cur_user_purposes TEXT[];
BEGIN
    -- 1. Fetch current user context
    SELECT * INTO cur_profile FROM public.profiles WHERE id = p_current_user_id;
    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Collect current user interests
    SELECT ARRAY_AGG(interest_id) INTO cur_user_likes
    FROM public.user_interests WHERE user_id = p_current_user_id AND type = 'like';
    IF cur_user_likes IS NULL THEN cur_user_likes := '{}'; END IF;

    SELECT ARRAY_AGG(interest_id) INTO cur_user_top_likes
    FROM public.user_interests WHERE user_id = p_current_user_id AND type = 'like' AND is_top = TRUE;
    IF cur_user_top_likes IS NULL THEN cur_user_top_likes := '{}'; END IF;

    SELECT ARRAY_AGG(interest_id) INTO cur_user_dislikes
    FROM public.user_interests WHERE user_id = p_current_user_id AND type = 'dislike';
    IF cur_user_dislikes IS NULL THEN cur_user_dislikes := '{}'; END IF;

    -- Collect current user purposes
    SELECT ARRAY_AGG(purpose) INTO cur_user_purposes
    FROM public.user_purposes WHERE user_id = p_current_user_id;
    IF cur_user_purposes IS NULL THEN cur_user_purposes := '{}'; END IF;

    RETURN QUERY
    WITH candidate_pool AS (
        SELECT 
            p.id AS c_id,
            p.full_name AS c_name,
            p.avatar_url AS c_avatar,
            p.course AS c_course,
            p.branch AS c_branch,
            p.year AS c_year,
            p.hostel_or_day AS c_hostel,
            p.bio::TEXT AS c_bio,
            p.languages AS c_lang,
            p.availability AS c_avail,
            COALESCE(
                (SELECT ARRAY_AGG(up.purpose) FROM public.user_purposes up WHERE up.user_id = p.id),
                '{}'::TEXT[]
            ) AS cand_purposes,
            COALESCE(
                (SELECT ARRAY_AGG(ui.interest_id) FROM public.user_interests ui WHERE ui.user_id = p.id AND ui.type = 'like'),
                '{}'::TEXT[]
            ) AS cand_likes,
            COALESCE(
                (SELECT ARRAY_AGG(ui.interest_id) FROM public.user_interests ui WHERE ui.user_id = p.id AND ui.type = 'like' AND ui.is_top = TRUE),
                '{}'::TEXT[]
            ) AS cand_top_likes,
            COALESCE(
                (SELECT ARRAY_AGG(ui.interest_id) FROM public.user_interests ui WHERE ui.user_id = p.id AND ui.type = 'dislike'),
                '{}'::TEXT[]
            ) AS cand_dislikes,
            (
                SELECT cr.status FROM public.connection_requests cr
                WHERE (cr.sender_id = p_current_user_id AND cr.receiver_id = p.id)
                   OR (cr.sender_id = p.id AND cr.receiver_id = p_current_user_id)
                LIMIT 1
            ) AS conn_status
        FROM public.profiles p
        JOIN public.privacy_settings ps ON ps.user_id = p.id
        WHERE p.id <> p_current_user_id
          AND p.is_suspended = FALSE
          AND ps.is_profile_hidden = FALSE
          AND NOT public.is_blocked(p.id)
          AND (p_filter_year IS NULL OR p.year = p_filter_year)
          AND (p_filter_branch IS NULL OR p.branch ILIKE '%' || p_filter_branch || '%')
    ),
    scored_candidates AS (
        SELECT 
            c.*,
            -- Overlapping purposes check (MUST have at least 1)
            ARRAY(
                SELECT unnest(c.cand_purposes)
                INTERSECT
                SELECT unnest(cur_user_purposes)
            ) AS common_purposes,
            -- Shared likes
            ARRAY(
                SELECT unnest(c.cand_likes)
                INTERSECT
                SELECT unnest(cur_user_likes)
            ) AS common_likes,
            -- Top 3 overlaps
            ARRAY(
                SELECT unnest(c.cand_top_likes)
                INTERSECT
                SELECT unnest(cur_user_top_likes)
            ) AS common_top_likes,
            -- Conflicts: candidate likes what user dislikes
            (
                SELECT COUNT(*)::INTEGER FROM (
                    SELECT unnest(c.cand_likes) INTERSECT SELECT unnest(cur_user_dislikes)
                    UNION ALL
                    SELECT unnest(c.cand_dislikes) INTERSECT SELECT unnest(cur_user_likes)
                ) conflicts
            ) AS conflict_num
        FROM candidate_pool c
    )
    SELECT 
        s.c_id AS peer_id,
        s.c_name AS full_name,
        s.c_avatar AS avatar_url,
        s.c_course AS course,
        s.c_branch AS branch,
        s.c_year AS year,
        s.c_hostel AS hostel_or_day,
        s.c_bio AS bio,
        s.c_lang AS languages,
        s.c_avail AS availability,
        -- Calculate normalized vibe score (clamped between 20 and 97)
        LEAST(97, GREATEST(20, (
            30 + (
                (COALESCE(cardinality(s.common_likes), 0) * 10) +
                (COALESCE(cardinality(s.common_top_likes), 0) * 10) -
                (s.conflict_num * 15) +
                (COALESCE(cardinality(s.common_purposes), 0) * 8) +
                (CASE WHEN LOWER(s.c_branch) = LOWER(cur_profile.branch) THEN 6 ELSE 0 END) +
                (CASE WHEN s.c_year = cur_profile.year THEN 5 ELSE 0 END) +
                (CASE WHEN s.c_hostel = cur_profile.hostel_or_day THEN 3 ELSE 0 END)
            ) * 0.75
        )::INTEGER)) AS vibe_score,
        -- Shared like names
        ARRAY(
            SELECT i.name FROM public.interests i WHERE i.id = ANY(s.common_likes)
        ) AS shared_likes,
        -- Top shared like names
        ARRAY(
            SELECT i.name FROM public.interests i WHERE i.id = ANY(s.common_top_likes)
        ) AS top_shared_likes,
        s.conflict_num AS conflict_count,
        s.common_purposes AS shared_purposes,
        COALESCE(s.conn_status, 'none') AS connection_status
    FROM scored_candidates s
    WHERE cardinality(s.common_purposes) > 0
      AND (p_filter_purpose IS NULL OR p_filter_purpose = ANY(s.cand_purposes))
    ORDER BY vibe_score DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$;

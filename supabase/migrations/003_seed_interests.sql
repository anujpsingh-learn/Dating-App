-- ====================================================================
-- VIBE CHECK: Migration 003 - Seed Master Interests Catalog
-- ====================================================================

INSERT INTO public.interests (id, name, category, icon) VALUES
-- Coding & Tech
('tech_ai', 'AI & Machine Learning', 'Coding & Tech', '🤖'),
('tech_web', 'Full-Stack Web Dev', 'Coding & Tech', '💻'),
('tech_app', 'Mobile App Dev', 'Coding & Tech', '📱'),
('tech_dsa', 'DSA & LeetCode', 'Coding & Tech', '⚡'),
('tech_hackathons', 'Hackathons', 'Coding & Tech', '🏆'),
('tech_open_source', 'Open Source', 'Coding & Tech', '🌐'),
('tech_cybersec', 'Cybersecurity & CTF', 'Coding & Tech', '🛡️'),
('tech_blockchain', 'Web3 & Blockchain', 'Coding & Tech', '⛓️'),
('tech_robotics', 'Robotics & IoT', 'Coding & Tech', '⚙️'),
('tech_cloud', 'Cloud & DevOps', 'Coding & Tech', '☁️'),

-- Music
('music_indie', 'Indie Rock / Pop', 'Music', '🎸'),
('music_hiphop', 'Hip-Hop & Rap', 'Music', '🎤'),
('music_lofi', 'Lo-Fi Beats', 'Music', '🎧'),
('music_edm', 'EDM & House', 'Music', '🎛️'),
('music_classical', 'Classical & Instrumental', 'Music', '🎻'),
('music_bollywood', 'Bollywood Hits', 'Music', '💃'),
('music_guitar', 'Acoustic Guitar', 'Music', '🎵'),
('music_singing', 'Singing & Jamming', 'Music', '🎙️'),
('music_kpop', 'K-Pop', 'Music', '✨'),

-- Sports & Fitness
('sports_badminton', 'Badminton', 'Sports & Fitness', '🏸'),
('sports_cricket', 'Cricket', 'Sports & Fitness', '🏏'),
('sports_football', 'Football / Soccer', 'Sports & Fitness', '⚽'),
('sports_gym', 'Gym & Calisthenics', 'Sports & Fitness', '🏋️'),
('sports_basketball', 'Basketball', 'Sports & Fitness', '🏀'),
('sports_running', 'Running & Marathons', 'Sports & Fitness', '🏃'),
('sports_swimming', 'Swimming', 'Sports & Fitness', '🏊'),
('sports_tabletennis', 'Table Tennis', 'Sports & Fitness', '🏓'),
('sports_chess', 'Chess', 'Sports & Fitness', '♟️'),

-- Gaming
('gaming_valorant', 'Valorant', 'Gaming', '🎯'),
('gaming_bgmi', 'BGMI / PUBG', 'Gaming', '🔫'),
('gaming_fifa', 'EA FC / FIFA', 'Gaming', '🎮'),
('gaming_minecraft', 'Minecraft', 'Gaming', '⛏️'),
('gaming_genshin', 'Genshin Impact', 'Gaming', '⚔️'),
('gaming_story', 'Single-Player RPGs', 'Gaming', '🕹️'),
('gaming_board', 'Board Games & Catan', 'Gaming', '🎲'),

-- Movies & Anime
('media_anime', 'Anime (Shonen/Seinen)', 'Movies & Anime', '🍥'),
('media_scifi', 'Sci-Fi & Christopher Nolan', 'Movies & Anime', '🚀'),
('media_kdrama', 'K-Dramas', 'Movies & Anime', '🌸'),
('media_sitcoms', 'Sitcoms (Office, B99)', 'Movies & Anime', '📺'),
('media_thrillers', 'Psychological Thrillers', 'Movies & Anime', '🍿'),
('media_worldcinema', 'World & Indie Cinema', 'Movies & Anime', '🎬'),

-- Art & Design
('art_uiux', 'UI/UX & Figma', 'Art & Design', '🎨'),
('art_photography', 'Photography & Lightroom', 'Art & Design', '📸'),
('art_digital', 'Digital Illustration', 'Art & Design', '🖌️'),
('art_3d', '3D Blender & Motion', 'Art & Design', '🧊'),
('art_sketching', 'Sketching & Doodling', 'Art & Design', '✏️'),

-- Books & Literature
('books_scifi_fantasy', 'Sci-Fi & Fantasy Novels', 'Books & Literature', '🐉'),
('books_nonfiction', 'Non-Fiction & Self Growth', 'Books & Literature', '📚'),
('books_philosophy', 'Philosophy & Stoicism', 'Books & Literature', '🏛️'),
('books_poetry', 'Poetry & Creative Writing', 'Books & Literature', '✍️'),
('books_manga', 'Manga & Light Novels', 'Books & Literature', '📖'),

-- Food & Dining
('food_cafes', 'Cafe Hopping & Coffee', 'Food & Dining', '☕'),
('food_street', 'Late Night Street Food', 'Food & Dining', '🥘'),
('food_cooking', 'Hostel Cooking Hacks', 'Food & Dining', '🍳'),
('food_baking', 'Baking & Desserts', 'Food & Dining', '🍰'),
('food_chai', 'Chai & Deep Talks', 'Food & Dining', '🍵'),

-- Travel & Adventure
('travel_trekking', 'Trekking & Hiking', 'Travel & Adventure', '🏔️'),
('travel_roadtrips', 'Weekend Roadtrips', 'Travel & Adventure', '🏍️'),
('travel_camping', 'Camping & Stargazing', 'Travel & Adventure', '⛺'),
('travel_backpacking', 'Budget Backpacking', 'Travel & Adventure', '🎒'),

-- Startups & Business
('biz_startups', 'Early Stage Startups', 'Startups & Business', '🚀'),
('biz_finance', 'Personal Finance & Stocks', 'Startups & Business', '📈'),
('biz_consulting', 'Case Competitions', 'Startups & Business', '💼'),
('biz_marketing', 'Growth Marketing', 'Startups & Business', '📣'),

-- Dance & Theatre
('dance_street', 'Street & Hip-Hop Dance', 'Dance & Theatre', '👟'),
('dance_contemporary', 'Classical / Contemporary', 'Dance & Theatre', '🩰'),
('dance_theatre', 'Street Plays (Nukkad Natak)', 'Dance & Theatre', '🎭'),
('dance_standup', 'Standup Comedy & Improv', 'Dance & Theatre', '🎙️'),

-- Podcasts & Content
('podcasts_tech', 'Tech & Science Podcasts', 'Podcasts & Content', '📻'),
('podcasts_history', 'History & Storytelling', 'Podcasts & Content', '📜'),
('podcasts_video', 'YouTube Video Creation', 'Podcasts & Content', '📹'),
('podcasts_memes', 'High-Tier Campus Memes', 'Podcasts & Content', '🐱')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    icon = EXCLUDED.icon;

import { Interest } from "@/types/database";

export const CATEGORIES = [
  "Coding & Tech",
  "Music",
  "Sports & Fitness",
  "Gaming",
  "Movies & Anime",
  "Art & Design",
  "Books & Literature",
  "Food & Dining",
  "Travel & Adventure",
  "Startups & Business",
  "Dance & Theatre",
  "Podcasts & Content",
] as const;

export const MASTER_INTERESTS: Interest[] = [
  // Coding & Tech
  { id: "tech_ai", name: "AI & Machine Learning", category: "Coding & Tech", icon: "🤖" },
  { id: "tech_web", name: "Full-Stack Web Dev", category: "Coding & Tech", icon: "💻" },
  { id: "tech_app", name: "Mobile App Dev", category: "Coding & Tech", icon: "📱" },
  { id: "tech_dsa", name: "DSA & LeetCode", category: "Coding & Tech", icon: "⚡" },
  { id: "tech_hackathons", name: "Hackathons", category: "Coding & Tech", icon: "🏆" },
  { id: "tech_open_source", name: "Open Source", category: "Coding & Tech", icon: "🌐" },
  { id: "tech_cybersec", name: "Cybersecurity & CTF", category: "Coding & Tech", icon: "🛡️" },
  { id: "tech_blockchain", name: "Web3 & Blockchain", category: "Coding & Tech", icon: "⛓️" },
  { id: "tech_robotics", name: "Robotics & IoT", category: "Coding & Tech", icon: "⚙️" },
  { id: "tech_cloud", name: "Cloud & DevOps", category: "Coding & Tech", icon: "☁️" },

  // Music
  { id: "music_indie", name: "Indie Rock / Pop", category: "Music", icon: "🎸" },
  { id: "music_hiphop", name: "Hip-Hop & Rap", category: "Music", icon: "🎤" },
  { id: "music_lofi", name: "Lo-Fi Beats", category: "Music", icon: "🎧" },
  { id: "music_edm", name: "EDM & House", category: "Music", icon: "🎛️" },
  { id: "music_classical", name: "Classical & Instrumental", category: "Music", icon: "🎻" },
  { id: "music_bollywood", name: "Bollywood Hits", category: "Music", icon: "💃" },
  { id: "music_guitar", name: "Acoustic Guitar", category: "Music", icon: "🎵" },
  { id: "music_singing", name: "Singing & Jamming", category: "Music", icon: "🎙️" },
  { id: "music_kpop", name: "K-Pop", category: "Music", icon: "✨" },

  // Sports & Fitness
  { id: "sports_badminton", name: "Badminton", category: "Sports & Fitness", icon: "🏸" },
  { id: "sports_cricket", name: "Cricket", category: "Sports & Fitness", icon: "🏏" },
  { id: "sports_football", name: "Football / Soccer", category: "Sports & Fitness", icon: "⚽" },
  { id: "sports_gym", name: "Gym & Calisthenics", category: "Sports & Fitness", icon: "🏋️" },
  { id: "sports_basketball", name: "Basketball", category: "Sports & Fitness", icon: "🏀" },
  { id: "sports_running", name: "Running & Marathons", category: "Sports & Fitness", icon: "🏃" },
  { id: "sports_swimming", name: "Swimming", category: "Sports & Fitness", icon: "🏊" },
  { id: "sports_tabletennis", name: "Table Tennis", category: "Sports & Fitness", icon: "🏓" },
  { id: "sports_chess", name: "Chess", category: "Sports & Fitness", icon: "♟️" },

  // Gaming
  { id: "gaming_valorant", name: "Valorant", category: "Gaming", icon: "🎯" },
  { id: "gaming_bgmi", name: "BGMI / PUBG", category: "Gaming", icon: "🔫" },
  { id: "gaming_fifa", name: "EA FC / FIFA", category: "Gaming", icon: "🎮" },
  { id: "gaming_minecraft", name: "Minecraft", category: "Gaming", icon: "⛏️" },
  { id: "gaming_genshin", name: "Genshin Impact", category: "Gaming", icon: "⚔️" },
  { id: "gaming_story", name: "Single-Player RPGs", category: "Gaming", icon: "🕹️" },
  { id: "gaming_board", name: "Board Games & Catan", category: "Gaming", icon: "🎲" },

  // Movies & Anime
  { id: "media_anime", name: "Anime (Shonen/Seinen)", category: "Movies & Anime", icon: "🍥" },
  { id: "media_scifi", name: "Sci-Fi & Christopher Nolan", category: "Movies & Anime", icon: "🚀" },
  { id: "media_kdrama", name: "K-Dramas", category: "Movies & Anime", icon: "🌸" },
  { id: "media_sitcoms", name: "Sitcoms (Office, B99)", category: "Movies & Anime", icon: "📺" },
  { id: "media_thrillers", name: "Psychological Thrillers", category: "Movies & Anime", icon: "🍿" },
  { id: "media_worldcinema", name: "World & Indie Cinema", category: "Movies & Anime", icon: "🎬" },

  // Art & Design
  { id: "art_uiux", name: "UI/UX & Figma", category: "Art & Design", icon: "🎨" },
  { id: "art_photography", name: "Photography & Lightroom", category: "Art & Design", icon: "📸" },
  { id: "art_digital", name: "Digital Illustration", category: "Art & Design", icon: "🖌️" },
  { id: "art_3d", name: "3D Blender & Motion", category: "Art & Design", icon: "🧊" },
  { id: "art_sketching", name: "Sketching & Doodling", category: "Art & Design", icon: "✏️" },

  // Books & Literature
  { id: "books_scifi_fantasy", name: "Sci-Fi & Fantasy Novels", category: "Books & Literature", icon: "🐉" },
  { id: "books_nonfiction", name: "Non-Fiction & Self Growth", category: "Books & Literature", icon: "📚" },
  { id: "books_philosophy", name: "Philosophy & Stoicism", category: "Books & Literature", icon: "🏛️" },
  { id: "books_poetry", name: "Poetry & Creative Writing", category: "Books & Literature", icon: "✍️" },
  { id: "books_manga", name: "Manga & Light Novels", category: "Books & Literature", icon: "📖" },

  // Food & Dining
  { id: "food_cafes", name: "Cafe Hopping & Coffee", category: "Food & Dining", icon: "☕" },
  { id: "food_street", name: "Late Night Street Food", category: "Food & Dining", icon: "🥘" },
  { id: "food_cooking", name: "Hostel Cooking Hacks", category: "Food & Dining", icon: "🍳" },
  { id: "food_baking", name: "Baking & Desserts", category: "Food & Dining", icon: "🍰" },
  { id: "food_chai", name: "Chai & Deep Talks", category: "Food & Dining", icon: "🍵" },

  // Travel & Adventure
  { id: "travel_trekking", name: "Trekking & Hiking", category: "Travel & Adventure", icon: "🏔️" },
  { id: "travel_roadtrips", name: "Weekend Roadtrips", category: "Travel & Adventure", icon: "🏍️" },
  { id: "travel_camping", name: "Camping & Stargazing", category: "Travel & Adventure", icon: "⛺" },
  { id: "travel_backpacking", name: "Budget Backpacking", category: "Travel & Adventure", icon: "🎒" },

  // Startups & Business
  { id: "biz_startups", name: "Early Stage Startups", category: "Startups & Business", icon: "🚀" },
  { id: "biz_finance", name: "Personal Finance & Stocks", category: "Startups & Business", icon: "📈" },
  { id: "biz_consulting", name: "Case Competitions", category: "Startups & Business", icon: "💼" },
  { id: "biz_marketing", name: "Growth Marketing", category: "Startups & Business", icon: "📣" },

  // Dance & Theatre
  { id: "dance_street", name: "Street & Hip-Hop Dance", category: "Dance & Theatre", icon: "👟" },
  { id: "dance_contemporary", name: "Classical / Contemporary", category: "Dance & Theatre", icon: "🩰" },
  { id: "dance_theatre", name: "Street Plays (Nukkad Natak)", category: "Dance & Theatre", icon: "🎭" },
  { id: "dance_standup", name: "Standup Comedy & Improv", category: "Dance & Theatre", icon: "🎙️" },

  // Podcasts & Content
  { id: "podcasts_tech", name: "Tech & Science Podcasts", category: "Podcasts & Content", icon: "📻" },
  { id: "podcasts_history", name: "History & Storytelling", category: "Podcasts & Content", icon: "📜" },
  { id: "podcasts_video", name: "YouTube Video Creation", category: "Podcasts & Content", icon: "📹" },
  { id: "podcasts_memes", name: "High-Tier Campus Memes", category: "Podcasts & Content", icon: "🐱" },
];

export const CAMPUS_PURPOSES = [
  {
    id: "Friends",
    title: "Friends & Hangouts",
    description: "Find friends to explore cafes, chill between lectures, and share campus life.",
    icon: "👥",
  },
  {
    id: "Study Partners",
    title: "Study Partners",
    description: "Tackle exams, assignments, library sessions, and gateprep together.",
    icon: "📚",
  },
  {
    id: "Project Teammates",
    title: "Project Teammates",
    description: "Build capstone projects, hackathon prototypes, or open source software.",
    icon: "💻",
  },
  {
    id: "Sports & Hobbies",
    title: "Sports & Hobbies",
    description: "Find gym buddies, badminton partners, gamers, or jam session players.",
    icon: "🏸",
  },
  {
    id: "Event Buddies",
    title: "Event Buddies",
    description: "Never attend college fests, concerts, hackathons, or workshops alone.",
    icon: "🎟️",
  },
] as const;

export const CAMPUS_AVAILABILITY = [
  "Weekday Evenings",
  "Weekends",
  "Between Classes",
  "Anytime Flexible",
] as const;

export const POPULAR_LANGUAGES = [
  "English",
  "Hindi",
  "Punjabi",
  "Bengali",
  "Telugu",
  "Tamil",
  "Malayalam",
  "Kannada",
  "Marathi",
  "Gujarati",
  "Urdu",
  "Spanish",
  "German",
  "Japanese",
] as const;

export const SAMPLE_COURSES = [
  "B.Tech Computer Science & Engineering",
  "B.Tech Artificial Intelligence & Data Science",
  "B.Tech Electronics & Communication",
  "B.Tech Mechanical Engineering",
  "B.Tech Civil Engineering",
  "B.Tech Biotechnology",
  "Bachelor of Design (B.Des)",
  "BCA / MCA",
  "BBA / MBA",
  "B.Sc Physics / Mathematics",
  "BA Journalism & Mass Comm",
  "B.Com (Hons)",
] as const;

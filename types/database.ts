export type Gender = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
export type ResidencyType = 'Hostel' | 'Day Scholar';
export type InterestType = 'like' | 'dislike';
export type ConnectionStatus = 'pending' | 'accepted' | 'declined';
export type ReportStatus = 'pending' | 'reviewed' | 'actioned' | 'dismissed';
export type GenderVisibility = 'everyone' | 'connections_only' | 'nobody';
export type RequestPermission = 'everyone' | 'same_branch_or_year' | 'nobody';

export type CampusPurpose =
  | 'Friends'
  | 'Study Partners'
  | 'Project Teammates'
  | 'Sports & Hobbies'
  | 'Event Buddies';

export type AvailabilitySlot =
  | 'Weekday Evenings'
  | 'Weekends'
  | 'Between Classes'
  | 'Anytime Flexible';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  age: number;
  gender: Gender;
  phone: string | null;
  course: string;
  branch: string;
  year: number;
  hostel_or_day: ResidencyType;
  avatar_url: string | null;
  bio: string;
  languages: string[];
  availability: AvailabilitySlot[];
  onboarding_step: number; // 1: About, 2: Interests, 3: Goals, 4: Complete
  is_suspended: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Interest {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export interface UserInterest {
  id: string;
  user_id: string;
  interest_id: string;
  type: InterestType;
  is_top: boolean;
  custom_name?: string | null;
  interest?: Interest;
}

export interface UserPurpose {
  user_id: string;
  purpose: CampusPurpose;
}

export interface ConnectionRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
  sender_profile?: Profile;
  receiver_profile?: Profile;
}

export interface PrivacySettings {
  user_id: string;
  show_gender: GenderVisibility;
  allow_requests_from: RequestPermission;
  is_profile_hidden: boolean;
  reveal_email_to_connections: boolean;
  reveal_phone_to_connections: boolean;
}

export interface Block {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  details?: string | null;
  status: ReportStatus;
  created_at: string;
  reporter?: Profile;
  reported?: Profile;
}

export interface CampusGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  banner_color: string;
  created_by: string;
  created_at: string;
  is_member?: boolean;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  category: string;
  rsvp_count: number;
  created_by: string;
  created_at: string;
  has_rsvped?: boolean;
}

export interface CandidateCard {
  profile: Profile;
  vibe_score: number;
  shared_likes: string[];
  top_shared_likes: string[];
  conflict_count: number;
  shared_purposes: CampusPurpose[];
  connection_status?: ConnectionStatus | 'none';
}

import { RewardStatus, RewardType } from "./enums";

export interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  subText?: string;
}

// 2. Data Models (Matches Supabase Schema)
export interface User {
  id: string; // uuid
  email: string;
  full_name: string;
  points_balance: number;
  current_streak: number;
  last_claim_date: string | null; // ISO timestamp
  referral_code: string | null;
  avatar_url?: string | null;
}

export interface Reward {
  id: number;
  title: string;
  description: string;
  cost: number;
  type: RewardType;
  image_url?: string;
  is_active: boolean;
  // Optional UI helper not in DB, but useful for frontend logic
  status?: RewardStatus; 
}

export interface RewardActivity {
  id: string;
  title: string;
  points: number;
  completed: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'streak' | 'info' | 'system' | 'reward';
  is_read: boolean;
  created_at: string;
}

export interface NotificationMessageProps {
  notification: {
    id: number;
    title: string;
    message: string;
    // Add other fields if necessary
  } | null;
  onClose: () => void;
}
export interface NotificationsPopoverProps {
  onSelectNotification: (notification: Notification) => void;
}

export type ModalType = 'STREAK_SUCCESS' | 'RECLAIM_FORM' | 'SHARE_STACK_EMPTY' | null;
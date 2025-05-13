
export interface SupabaseTask {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseCategory {
  id: string;
  name: string;
  user_id: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string;
}

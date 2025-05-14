
export interface DbTask {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  category: string;
  priority: string;
  completed: boolean;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  reminder_date: string | null;
  recurrence: string | null;
}

export interface DbCategory {
  id: string;
  name: string;
  user_id: string | null;
  created_at: string;
}

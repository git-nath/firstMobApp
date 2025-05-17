export interface Task {
  id: string;
  title: string;
  dueDate: string | null;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: string;
}

export type TaskFilter = 'all' | 'active' | 'completed';
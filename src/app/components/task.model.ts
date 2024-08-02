export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'closed';
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskStatus {
  pending: number;
  completed: number;
  closed: number;
}

export interface TaskPriority {
  low: number;
  medium: number;
  high: number;
}

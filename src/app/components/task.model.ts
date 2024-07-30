export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'closed';
}

export interface TaskStatus {
  pending: number;
  completed: number;
  closed: number;
}

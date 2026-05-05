export type Priority = 'high' | 'medium' | 'low';
export type FilterStatus = 'all' | 'active' | 'completed';
export type SortBy = 'createdAt' | 'dueDate' | 'priority';

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

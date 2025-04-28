export interface Todo {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  dueDate?: string;
}

export const todos: Todo[] = [
  {
    id: '1',
    title: 'Plan Birthday Celebration',
    description: 'Organize a special day with all favorite activities',
    isCompleted: false,
    createdAt: '2024-04-25',
    dueDate: '2024-04-28'
  },
  {
    id: '2',
    title: 'Prepare Gift',
    description: 'Wrap the special present',
    isCompleted: true,
    createdAt: '2024-04-24',
    dueDate: '2024-04-28'
  },
  {
    id: '3',
    title: 'Make Birthday Card',
    description: 'Create a handmade card with personal message',
    isCompleted: false,
    createdAt: '2024-04-26',
    dueDate: '2024-04-28'
  }
]; 
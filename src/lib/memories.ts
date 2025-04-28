export interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  isHighlighted: boolean;
}

export const memories: Memory[] = [
  {
    id: '1',
    title: 'Our First Date',
    date: '2023-01-15',
    description: 'The day we first met and had coffee together',
    imageUrl: '/memories/dummy.jpg',
    isHighlighted: true
  },
  {
    id: '2',
    title: 'Beach Vacation',
    date: '2023-07-20',
    description: 'Our amazing summer getaway by the sea',
    imageUrl: '/memories/dummy.jpg',
    isHighlighted: true
  },
  {
    id: '3',
    title: 'Christmas Together',
    date: '2023-12-25',
    description: 'Our first Christmas celebration as a couple',
    imageUrl: '/memories/dummy.jpg',
    isHighlighted: true
  },
  
]; 
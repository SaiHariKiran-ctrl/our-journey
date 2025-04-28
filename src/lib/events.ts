export interface Event {
  id: string;
  title: string;
  date: string; // Format: DD-MM
  type: 'birthday' | 'anniversary' | 'other';
  description?: string;
}

export const events: Event[] = [
  {
    id: '1',
    title: 'Happy Birthday Kiran',
    date: '03-12', //DD-MM
    type: 'birthday',
    description: 'Celebrating another wonderful year!'
  },
  {
    id: '2',
    title: 'Happy Birthday Madhu',
    date: '01-04', //DD-MM
    type: 'birthday',
    description: 'Celebrating another wonderful year!'
  },
];

export function isEventToday(eventDate: string): boolean {
  const today = new Date();
  const [day, month] = eventDate.split('-').map(Number);
  
  return today.getDate() === day && (today.getMonth() + 1) === month;
} 
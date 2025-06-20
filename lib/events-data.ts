// Shared events data store

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  createdAt: string;
  userEmail: string;
}

// Mock database - in a real app, you'd use a proper database
let events: Event[] = [
  {
    _id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync meeting',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    location: 'Conference Room A',
    type: 'meeting',
    createdAt: new Date().toISOString(),
    userEmail: 'user@example.com'
  },
  {
    _id: '2',
    title: 'Doctor Appointment',
    description: 'Annual checkup',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '10:30',
    location: 'Medical Center',
    type: 'appointment',
    createdAt: new Date().toISOString(),
    userEmail: 'user@example.com'
  }
];

/**
 * Get events for a specific user
 */
export function getEventsByUser(userEmail: string): Event[] {
  return events
    .filter(event => event.userEmail === userEmail)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Add a new event
 */
export function addEvent(event: Event): void {
  events.push(event);
}

/**
 * Delete an event by ID and user email
 */
export function deleteEvent(eventId: string, userEmail: string): boolean {
  const initialLength = events.length;
  events = events.filter(event => !(event._id === eventId && event.userEmail === userEmail));
  return events.length < initialLength;
}

/**
 * Update an event
 */
export function updateEvent(eventId: string, userEmail: string, updatedEvent: Partial<Event>): boolean {
  const eventIndex = events.findIndex(event => event._id === eventId && event.userEmail === userEmail);
  if (eventIndex !== -1) {
    events[eventIndex] = { ...events[eventIndex], ...updatedEvent };
    return true;
  }
  return false;
}

/**
 * Generate a unique event ID
 */
export function generateEventId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

/**
 * Get all events (for admin purposes)
 */
export function getAllEvents(): Event[] {
  return events;
}
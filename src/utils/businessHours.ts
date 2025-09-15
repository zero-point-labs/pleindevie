/**
 * Business hours utility functions for Plein De Vie barbershop
 */

export interface BusinessHours {
  day: string;
  time: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

// Business hours - matches the schedule from WorkingHours component
export const BUSINESS_HOURS: BusinessHours[] = [
  { day: 'Δευτέρα', time: 'ΚΛΕΙΣΤΟ', isOpen: false },
  { day: 'Τρίτη', time: '09:00 - 19:00', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'Τετάρτη', time: '09:00 - 19:00', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'Πέμπτη', time: '09:00 - 19:00', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'Παρασκευή', time: '09:00 - 19:00', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'Σάββατο', time: '09:00 - 16:00', isOpen: true, openTime: '09:00', closeTime: '16:00' },
  { day: 'Κυριακή', time: 'ΚΛΕΙΣΤΟ', isOpen: false },
];

/**
 * Get the current business status
 * @returns Object with isOpen status and display text
 */
export function getCurrentBusinessStatus(): {
  isOpen: boolean;
  displayText: string;
  displayColor: string;
} {
  const now = new Date();
  
  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const currentDay = now.getDay();
  
  // Map JavaScript day to our business hours array index
  // JavaScript: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
  // Our array: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
  const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Maps JS day to our array index
  const todayIndex = dayMap[currentDay];
  
  const todayHours = BUSINESS_HOURS[todayIndex];
  
  // If the business is closed today
  if (!todayHours.isOpen) {
    return {
      isOpen: false,
      displayText: 'Κλειστό Σήμερα',
      displayColor: 'text-red-400'
    };
  }
  
  // Check if current time is within business hours
  const currentTime = now.getHours() * 100 + now.getMinutes(); // e.g., 14:30 = 1430
  
  if (todayHours.openTime && todayHours.closeTime) {
    const [openHour, openMin] = todayHours.openTime.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.closeTime.split(':').map(Number);
    
    const openTime = openHour * 100 + openMin;
    const closeTime = closeHour * 100 + closeMin;
    
    if (currentTime >= openTime && currentTime < closeTime) {
      return {
        isOpen: true,
        displayText: 'Ανοιχτά Τώρα',
        displayColor: 'text-green-400'
      };
    } else if (currentTime < openTime) {
      return {
        isOpen: false,
        displayText: `Ανοίγει στις ${todayHours.openTime}`,
        displayColor: 'text-yellow-400'
      };
    } else {
      return {
        isOpen: false,
        displayText: 'Κλειστό Σήμερα',
        displayColor: 'text-red-400'
      };
    }
  }
  
  // Fallback
  return {
    isOpen: false,
    displayText: 'Κλειστό',
    displayColor: 'text-red-400'
  };
}

/**
 * Get next opening time if currently closed
 * @returns String with next opening information
 */
export function getNextOpeningTime(): string {
  const now = new Date();
  const currentDay = now.getDay();
  const dayMap = [6, 0, 1, 2, 3, 4, 5];
  
  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const nextDay = (currentDay + i) % 7;
    const nextDayIndex = dayMap[nextDay];
    const nextDayHours = BUSINESS_HOURS[nextDayIndex];
    
    if (nextDayHours.isOpen && nextDayHours.openTime) {
      const dayNames = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
      const dayName = i === 1 ? 'Αύριο' : dayNames[nextDay];
      return `${dayName} στις ${nextDayHours.openTime}`;
    }
  }
  
  return 'Σύντομα';
}

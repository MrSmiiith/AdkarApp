import moment from 'moment-hijri';

export interface IslamicEvent {
  name: string;
  nameAr: string;
  month: number; // Islamic month (1-12)
  day: number;
  description: string;
  isImportant: boolean;
}

// Islamic events based on Hijri calendar
const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    name: 'Islamic New Year',
    nameAr: 'رأس السنة الهجرية',
    month: 1,
    day: 1,
    description: 'First of Muharram',
    isImportant: true,
  },
  {
    name: 'Day of Ashura',
    nameAr: 'يوم عاشوراء',
    month: 1,
    day: 10,
    description: 'Recommended fasting',
    isImportant: true,
  },
  {
    name: 'Mawlid al-Nabi',
    nameAr: 'المولد النبوي',
    month: 3,
    day: 12,
    description: "Prophet Muhammad's Birthday",
    isImportant: true,
  },
  {
    name: 'Isra and Miraj',
    nameAr: 'الإسراء والمعراج',
    month: 7,
    day: 27,
    description: 'Night Journey',
    isImportant: true,
  },
  {
    name: 'Laylat al-Bara\'ah',
    nameAr: 'ليلة البراءة',
    month: 8,
    day: 15,
    description: 'Night of Forgiveness',
    isImportant: true,
  },
  {
    name: 'First of Ramadan',
    nameAr: 'أول رمضان',
    month: 9,
    day: 1,
    description: 'Start of fasting month',
    isImportant: true,
  },
  {
    name: 'Laylat al-Qadr',
    nameAr: 'ليلة القدر',
    month: 9,
    day: 27,
    description: 'Night of Power (likely night)',
    isImportant: true,
  },
  {
    name: 'Eid al-Fitr',
    nameAr: 'عيد الفطر',
    month: 10,
    day: 1,
    description: 'Festival of Breaking the Fast',
    isImportant: true,
  },
  {
    name: 'Day of Arafah',
    nameAr: 'يوم عرفة',
    month: 12,
    day: 9,
    description: 'Recommended fasting for non-pilgrims',
    isImportant: true,
  },
  {
    name: 'Eid al-Adha',
    nameAr: 'عيد الأضحى',
    month: 12,
    day: 10,
    description: 'Festival of Sacrifice',
    isImportant: true,
  },
];

/**
 * Get current or upcoming Islamic event
 */
export const getUpcomingEvent = (): IslamicEvent | null => {
  const now = moment();
  const currentMonth = now.iMonth() + 1; // iMonth is 0-indexed
  const currentDay = now.iDate();

  // Find next event
  for (const event of ISLAMIC_EVENTS) {
    if (event.month > currentMonth || (event.month === currentMonth && event.day >= currentDay)) {
      return event;
    }
  }

  // If no event found this year, return first event of next year
  return ISLAMIC_EVENTS[0];
};

/**
 * Get today's Islamic event if any
 */
export const getTodayEvent = (): IslamicEvent | null => {
  const now = moment();
  const currentMonth = now.iMonth() + 1;
  const currentDay = now.iDate();

  const event = ISLAMIC_EVENTS.find(
    (e) => e.month === currentMonth && e.day === currentDay
  );

  return event || null;
};

/**
 * Get days until next event (simplified calculation)
 */
export const getDaysUntilEvent = (event: IslamicEvent): number => {
  const now = moment();
  const currentMonth = now.iMonth() + 1;
  const currentDay = now.iDate();
  const currentYear = now.iYear();

  // Approximate days per Islamic month
  const avgDaysPerMonth = 29.5;

  // Calculate rough days until event
  let monthsUntil = event.month - currentMonth;
  let daysUntil = event.day - currentDay;

  if (monthsUntil < 0 || (monthsUntil === 0 && daysUntil < 0)) {
    // Event is next year
    monthsUntil += 12;
  }

  const approximateDays = Math.round(monthsUntil * avgDaysPerMonth + daysUntil);
  return Math.max(0, approximateDays);
};

/**
 * Format event date string
 */
export const formatEventDate = (event: IslamicEvent): string => {
  return `${event.day} ${getMonthName(event.month)}`;
};

/**
 * Get Islamic month name
 */
const getMonthName = (month: number): string => {
  const months = [
    'Muharram',
    'Safar',
    'Rabi al-Awwal',
    'Rabi al-Thani',
    'Jumada al-Awwal',
    'Jumada al-Thani',
    'Rajab',
    'Sha\'ban',
    'Ramadan',
    'Shawwal',
    'Dhul-Qi\'dah',
    'Dhul-Hijjah',
  ];
  return months[month - 1] || '';
};

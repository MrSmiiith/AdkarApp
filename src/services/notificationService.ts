import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { PrayerTimes, PrayerName, Coordinates, PrayerSettings } from '../types';
import { calculatePrayerTimes } from './prayerService';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Prayer notification identifiers
 */
const NOTIFICATION_IDS = {
  fajr: 'prayer-fajr',
  dhuhr: 'prayer-dhuhr',
  asr: 'prayer-asr',
  maghrib: 'prayer-maghrib',
  isha: 'prayer-isha',
};

/**
 * Prayer display names
 */
const PRAYER_NAMES = {
  fajr: { en: 'Fajr', ar: 'الفجر' },
  dhuhr: { en: 'Dhuhr', ar: 'الظهر' },
  asr: { en: 'Asr', ar: 'العصر' },
  maghrib: { en: 'Maghrib', ar: 'المغرب' },
  isha: { en: 'Isha', ar: 'العشاء' },
};

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('prayer-times', {
        name: 'Prayer Times',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10b981',
        sound: 'default', // We'll use custom Adhan sound later
        enableVibrate: true,
        enableLights: true,
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Schedule prayer notifications for today and tomorrow
 */
export const schedulePrayerNotifications = async (
  location: Coordinates,
  settings: PrayerSettings,
  language: 'en' | 'ar' = 'en'
): Promise<void> => {
  try {
    // Cancel all existing prayer notifications
    await cancelAllPrayerNotifications();

    // Get today's prayer times
    const todayPrayers = calculatePrayerTimes(location, new Date(), settings);

    // Get tomorrow's prayer times
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPrayers = calculatePrayerTimes(location, tomorrow, settings);

    const now = new Date();

    // Schedule today's remaining prayers
    await scheduleNotificationsForDay(todayPrayers, settings.notifications, language, now);

    // Schedule tomorrow's prayers
    await scheduleNotificationsForDay(tomorrowPrayers, settings.notifications, language);

    console.log('Prayer notifications scheduled successfully');
  } catch (error) {
    console.error('Error scheduling prayer notifications:', error);
  }
};

/**
 * Schedule notifications for a specific day
 */
const scheduleNotificationsForDay = async (
  prayerTimes: PrayerTimes,
  notificationSettings: { [key in PrayerName]: boolean },
  language: 'en' | 'ar',
  afterTime?: Date
): Promise<void> => {
  const prayers: Array<{ name: PrayerName; time: Date }> = [
    { name: 'fajr', time: prayerTimes.fajr },
    { name: 'dhuhr', time: prayerTimes.dhuhr },
    { name: 'asr', time: prayerTimes.asr },
    { name: 'maghrib', time: prayerTimes.maghrib },
    { name: 'isha', time: prayerTimes.isha },
  ];

  for (const prayer of prayers) {
    // Skip if notification is disabled for this prayer
    if (!notificationSettings[prayer.name]) {
      continue;
    }

    // Skip if prayer time has already passed (only for today)
    if (afterTime && prayer.time <= afterTime) {
      continue;
    }

    await schedulePrayerNotification(prayer.name, prayer.time, language);
  }
};

/**
 * Schedule a single prayer notification
 */
const schedulePrayerNotification = async (
  prayerName: PrayerName,
  prayerTime: Date,
  language: 'en' | 'ar'
): Promise<void> => {
  try {
    const prayerDisplayName = PRAYER_NAMES[prayerName][language];

    const title = language === 'ar'
      ? `🕌 حان وقت صلاة ${prayerDisplayName}`
      : `🕌 Time for ${prayerDisplayName} Prayer`;

    const body = language === 'ar'
      ? 'حان الآن وقت الصلاة'
      : 'It is now time to pray';

    // Calculate trigger time
    const trigger = prayerTime.getTime();
    const now = Date.now();

    if (trigger <= now) {
      return; // Don't schedule past notifications
    }

    await Notifications.scheduleNotificationAsync({
      identifier: `${NOTIFICATION_IDS[prayerName]}-${prayerTime.toDateString()}`,
      content: {
        title,
        body,
        sound: 'default', // TODO: Replace with custom Adhan sound
        priority: Notifications.AndroidNotificationPriority.MAX,
        vibrate: [0, 250, 250, 250],
        data: { prayerName, prayerTime: prayerTime.toISOString() },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
      } as Notifications.DateTriggerInput,
    });

    console.log(`Scheduled ${prayerName} notification for ${prayerTime.toLocaleString()}`);
  } catch (error) {
    console.error(`Error scheduling ${prayerName} notification:`, error);
  }
};

/**
 * Cancel all prayer notifications
 */
export const cancelAllPrayerNotifications = async (): Promise<void> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

    // Filter prayer notifications
    const prayerNotifications = scheduledNotifications.filter(notification =>
      notification.identifier.startsWith('prayer-')
    );

    // Cancel each prayer notification
    for (const notification of prayerNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }

    console.log(`Cancelled ${prayerNotifications.length} prayer notifications`);
  } catch (error) {
    console.error('Error cancelling prayer notifications:', error);
  }
};

/**
 * Cancel notification for a specific prayer
 */
export const cancelPrayerNotification = async (prayerName: PrayerName): Promise<void> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

    // Find and cancel notifications for this prayer
    const notificationsToCancel = scheduledNotifications.filter(notification =>
      notification.identifier.includes(NOTIFICATION_IDS[prayerName])
    );

    for (const notification of notificationsToCancel) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }

    console.log(`Cancelled ${prayerName} notifications`);
  } catch (error) {
    console.error(`Error cancelling ${prayerName} notification:`, error);
  }
};

/**
 * Get all scheduled prayer notifications (for debugging)
 */
export const getScheduledPrayerNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    return scheduledNotifications.filter(notification =>
      notification.identifier.startsWith('prayer-')
    );
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

/**
 * Check if notifications are enabled
 */
export const areNotificationsEnabled = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
};

/**
 * Listen for notification responses (when user taps a notification)
 */
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

/**
 * Listen for incoming notifications (when notification is received)
 */
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
) => {
  return Notifications.addNotificationReceivedListener(callback);
};

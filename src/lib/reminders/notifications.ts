export type NotificationSupport = "full" | "in-app-only" | "unsupported";

export function getNotificationSupport(): NotificationSupport {
  if (typeof window === "undefined") return "unsupported";

  const hasNotification = typeof Notification !== "undefined";
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true);

  if (!hasNotification) return "in-app-only";

  // iOS Safari only supports web notifications for installed PWAs.
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isIos && !isStandalone) return "in-app-only";

  return "full";
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (typeof Notification === "undefined") return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof Notification === "undefined") return "unsupported";
  if (Notification.permission !== "default") return Notification.permission;
  return Notification.requestPermission();
}

export async function showReminderNotification(
  title: string,
  body: string,
  tag: string
): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const support = getNotificationSupport();
  if (support === "unsupported" || support === "in-app-only") return false;
  if (Notification.permission !== "granted") return false;

  const options: NotificationOptions = {
    body,
    tag,
    icon: "/icon",
    badge: "/icon",
    requireInteraction: true,
  };

  try {
    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register("/sw.js");
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, options);
      return true;
    }
  } catch {
    // fall through to Notification constructor
  }

  try {
    new Notification(title, options);
    return true;
  } catch {
    return false;
  }
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function isStandaloneApp(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function scheduleLocalNotification(
  meetingDay: string,
  meetingTime: string,
  minutesBefore: number
): (() => void) | null {
  if (!("serviceWorker" in navigator) || Notification.permission !== "granted") {
    return null;
  }

  const now = new Date();
  const todayDay = now.toLocaleDateString("en-US", { weekday: "long" });

  if (todayDay !== meetingDay) return null;

  const meetingDate = parseMeetingTime(meetingTime, now);
  const notifyAt = new Date(meetingDate.getTime() - minutesBefore * 60_000);
  const delay = notifyAt.getTime() - now.getTime();

  if (delay <= 0) return null;

  const timerId = window.setTimeout(async () => {
    const reg = await navigator.serviceWorker?.ready;
    if (reg) {
      reg.showNotification("Tuneup starts soon!", {
        body: `Your weekly tuneup begins in ${minutesBefore} minutes.`,
        icon: "/icon-192.png",
        tag: "tuneup-reminder-local",
      });
    }
  }, delay);

  return () => clearTimeout(timerId);
}

function parseMeetingTime(timeStr: string, today: Date): Date {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const result = new Date(today);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

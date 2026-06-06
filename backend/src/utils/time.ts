/**
 * Parses a time string (e.g. "09:00 AM", "15:30", "1:00 PM") and returns the time in minutes from midnight.
 */
export function parseTimeToMinutes(timeStr: string): number {
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/^(\d+):(\d+)\s*(AM|PM)?$/);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3];

  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Calculates the difference in hours between two time strings.
 * Spans across midnight if the end time is before or equal to start time.
 */
export function getDurationInHours(start: string, end: string): number {
  const startMins = parseTimeToMinutes(start);
  const endMins = parseTimeToMinutes(end);
  let diff = endMins - startMins;
  if (diff <= 0) {
    diff += 24 * 60; // Assume it spans to the next day
  }
  return diff / 60;
}

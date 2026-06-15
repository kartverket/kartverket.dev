export function isRecent(dateFirstSeen?: string, thresholdDays = 7): boolean {
  if (!dateFirstSeen) return false;
  const t = new Date(dateFirstSeen).getTime();
  if (Number.isNaN(t)) return false;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const cutoff = startOfToday.getTime() - thresholdDays * 24 * 60 * 60 * 1000;
  return t >= cutoff;
}

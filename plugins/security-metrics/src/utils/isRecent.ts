export function isRecent(dateFirstSeen?: string, thresholdDays = 7): boolean {
  if (!dateFirstSeen) return false;
  const t = new Date(dateFirstSeen).getTime();
  if (Number.isNaN(t)) return false;
  const diffDays = Math.floor((Date.now() - t) / (1000 * 60 * 60 * 24));
  return diffDays <= thresholdDays;
}

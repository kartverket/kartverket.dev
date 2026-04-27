export type Freshness = 'OPPDATERT' | 'NY';

export function freshnessLabel(
  dateFirstSeen?: string,
  severityUpdatedAt?: string,
  thresholdDays = 7,
): Freshness | boolean {
  if (severityUpdatedAt) {
    const updatedTime = new Date(severityUpdatedAt).getTime();
    if (!Number.isNaN(updatedTime)) {
      const updatedDiffDays = Math.floor(
        (Date.now() - updatedTime) / (1000 * 60 * 60 * 24),
      );
      if (updatedDiffDays <= thresholdDays) return 'OPPDATERT';
    }
  }
  if (!dateFirstSeen) return false;
  const t = new Date(dateFirstSeen).getTime();
  if (Number.isNaN(t)) return false;
  const diffDays = Math.floor((Date.now() - t) / (1000 * 60 * 60 * 24));
  if (diffDays <= thresholdDays) {
    return 'NY';
  }

  return false;
}

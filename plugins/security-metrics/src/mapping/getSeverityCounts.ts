import { SeverityCount } from '../typesFrontend';

export const aggregateSeverityCounts = <T>(
  items: T[],
  getSeverityObject: (item: T) => Partial<SeverityCount>,
): SeverityCount => {
  return items.reduce(
    (totals, item) => {
      const counts = getSeverityObject(item) ?? {};
      Object.keys(totals).forEach(key => {
        const severityKey = key as keyof SeverityCount;
        totals[severityKey] += counts[severityKey] || 0;
      });
      return totals;
    },
    {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      negligible: 0,
      unknown: 0,
    },
  );
};

export const getTotalVulnerabilityCount = (severityCount: SeverityCount) => {
  return (
    severityCount.critical +
    severityCount.high +
    severityCount.medium +
    severityCount.low +
    severityCount.negligible +
    severityCount.unknown
  );
};

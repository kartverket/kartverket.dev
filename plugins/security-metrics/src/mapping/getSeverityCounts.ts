import {
  SeverityCount,
  SikkerhetsmetrikkerSystemTotal,
} from '../typesFrontend';

export const aggregateSeverityCounts = <T>(
  items: T[],
  getSeverityObject: (item: T) => Partial<SeverityCount>,
): SeverityCount => {
  return items.reduce(
    (totals, item) => {
      const counts = getSeverityObject(item);
      const severityKeys = [
        'critical',
        'high',
        'medium',
        'low',
        'negligible',
        'unknown',
      ] satisfies Array<keyof SeverityCount>;

      severityKeys.forEach(severityKey => {
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

export const getSeverityCountPerSystem = (
  data: SikkerhetsmetrikkerSystemTotal[],
  showOpen: boolean,
): { systemName: string; severityCount: SeverityCount }[] =>
  data.map(s => {
    const total: SeverityCount = {
      unknown: 0,
      negligible: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    for (const repo of s.metrics?.permittedMetrics ?? []) {
      const sc = showOpen ? repo.openSeverityCount : repo.severityCount;

      total.unknown += sc.unknown;
      total.negligible += sc.negligible;
      total.low += sc.low;
      total.medium += sc.medium;
      total.high += sc.high;
      total.critical += sc.critical;
    }

    return { systemName: s.systemName, severityCount: total };
  });

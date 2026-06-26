import type { AggregatedVulnerability } from '../../typesFrontend';

export type SortType = 'Komponenter' | 'Alvorlighetsgrad';
export type SortOrder = 'asc' | 'desc';

export const severityRank: Record<AggregatedVulnerability['severity'], number> =
  {
    critical: 5,
    high: 4,
    medium: 3,
    low: 2,
    negligible: 1,
    unknown: 0,
  };

export const compareBySeverity = (
  a: AggregatedVulnerability,
  b: AggregatedVulnerability,
) => severityRank[b.severity] - severityRank[a.severity];

export const compareByAffectedComponents = (
  a: AggregatedVulnerability,
  b: AggregatedVulnerability,
) => b.affectedComponents.length - a.affectedComponents.length;

export const matchesSearch = (
  vulnerability: AggregatedVulnerability,
  query: string,
) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [
    vulnerability.vulnerabilityId,
    vulnerability.summary,
    vulnerability.severity,
    ...vulnerability.affectedComponents,
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery);
};

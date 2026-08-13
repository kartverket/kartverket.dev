import type { AggregatedVulnerability } from '../../typesFrontend';
import { aggregatedToRiskInputs, computeRiskScore } from '../shared/riskScore';

export type SortType = 'Komponenter' | 'Alvorlighetsgrad' | 'Prioritet';
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

export const compareByPriority = (
  a: AggregatedVulnerability,
  b: AggregatedVulnerability,
) =>
  computeRiskScore(aggregatedToRiskInputs(b)) -
  computeRiskScore(aggregatedToRiskInputs(a));

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
    ...vulnerability.affectedComponents.map(c => c.componentName),
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery);
};

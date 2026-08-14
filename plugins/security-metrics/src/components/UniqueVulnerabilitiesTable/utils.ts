import type {
  AggregatedAffectedComponent,
  AggregatedVulnerability,
} from '../../typesFrontend';
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

export const formatClusterLabel = (cluster: string): string => {
  const suffix = cluster.split('_').pop();
  return suffix ? suffix.toLowerCase() : cluster.toLowerCase();
};

export const sortClusters = (clusters: string[]): string[] =>
  [...clusters].sort((a, b) => {
    const labelA = formatClusterLabel(a);
    const labelB = formatClusterLabel(b);
    if (labelA === 'prod' && labelB !== 'prod') return -1;
    if (labelB === 'prod' && labelA !== 'prod') return 1;
    return labelA.localeCompare(labelB);
  });

export const groupClustersByLabel = (
  clusters: string[],
): Map<string, string[]> => {
  const groups = new Map<string, string[]>();
  clusters.forEach(cluster => {
    const label = formatClusterLabel(cluster);
    const raws = groups.get(label) ?? [];
    if (!raws.includes(cluster)) raws.push(cluster);
    groups.set(label, raws);
  });
  return groups;
};

export const componentMatchesClusters = (
  component: AggregatedAffectedComponent,
  clusterLabels: string[],
): boolean => {
  if (clusterLabels.length === 0) return true;
  const clusters = component.sysdigClusters;
  if (!clusters?.length) return true;
  return clusters.some(cl => clusterLabels.includes(formatClusterLabel(cl)));
};

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

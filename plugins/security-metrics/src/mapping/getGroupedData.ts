import { Secrets } from '../components/SecretsOverview/SecretsDialog';
import {
  SikkerhetsmetrikkerSystemTotal,
  RepositorySummary,
} from '../typesFrontend';

export const getAllSecrets = (
  data: SikkerhetsmetrikkerSystemTotal[],
): Secrets[] => {
  const seen = new Set<string>();
  return data
    .flatMap(s => s.metrics?.permittedMetrics ?? [])
    .filter(r => {
      if (seen.has(r.repoName)) return false;
      seen.add(r.repoName);
      return true;
    })
    .map(r => ({
      componentName: r.repoName,
      alerts: r.secrets?.alerts ?? [],
    }))
    .filter(s => s.alerts.length > 0);
};

export const getAllPermittedMetrics = (
  data: SikkerhetsmetrikkerSystemTotal[],
): RepositorySummary[] => {
  const repoMap = new Map<string, RepositorySummary>();

  for (const item of data.flatMap(s => s.metrics?.permittedMetrics ?? [])) {
    const existing = repoMap.get(item.repoName);
    if (existing) {
      existing.componentNames = [
        ...existing.componentNames,
        ...item.componentNames.filter(
          n => !existing.componentNames.includes(n),
        ),
      ];
    } else {
      repoMap.set(item.repoName, { ...item });
    }
  }

  return Array.from(repoMap.values());
};

export const getAllNotPermittedComponents = (
  data: SikkerhetsmetrikkerSystemTotal[],
): string[] => data.flatMap(s => s.metrics?.notPermittedComponents ?? []);

export type NotPermittedInfo = {
  systemName: string;
  components: string[];
};
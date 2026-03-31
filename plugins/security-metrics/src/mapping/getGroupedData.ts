import { Secrets } from '../components/SecretsOverview/SecretsDialog';
import {
  AggregatedSikkerhetsmetrikker,
  RepositorySummary,
} from '../typesFrontend';

export const getAllSecrets = (
  data: AggregatedSikkerhetsmetrikker,
): Secrets[] => {
  const seen = new Set<string>();

  return data.systems
    .flatMap(system => system.metrics?.permittedMetrics ?? [])
    .filter(repo => {
      if (seen.has(repo.repoName)) {
        return false;
      }

      seen.add(repo.repoName);
      return true;
    })
    .map(repo => ({
      componentName: repo.repoName,
      alerts: repo.secrets?.alerts ?? [],
    }))
    .filter(secret => secret.alerts.length > 0);
};

export const getAllPermittedMetrics = (
  data: AggregatedSikkerhetsmetrikker,
): RepositorySummary[] => {
  const repoMap = new Map<string, RepositorySummary>();

  for (const item of data.systems.flatMap(
    system => system.metrics?.permittedMetrics ?? [],
  )) {
    const existing = repoMap.get(item.repoName);

    if (existing) {
      existing.componentNames = [
        ...existing.componentNames,
        ...item.componentNames.filter(
          componentName => !existing.componentNames.includes(componentName),
        ),
      ];
      continue;
    }

    repoMap.set(item.repoName, {
      ...item,
      componentNames: [...item.componentNames],
    });
  }

  return Array.from(repoMap.values());
};

export const getAllNotPermittedComponents = (
  data: AggregatedSikkerhetsmetrikker,
): string[] =>
  data.systems.flatMap(system => system.metrics?.notPermittedComponents ?? []);

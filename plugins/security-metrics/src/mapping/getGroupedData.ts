import { Secrets } from '../components/SecretsOverview/SecretsDialog';
import {
  SikkerhetsmetrikkerSystemTotal,
  RepositorySummary,
} from '../typesFrontend';

export const getAllSecrets = (
  systems: SikkerhetsmetrikkerSystemTotal[],
): Secrets[] => {
  const seen = new Set<string>();

  return systems
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
  systems: SikkerhetsmetrikkerSystemTotal[],
): RepositorySummary[] => {
  const repoMap = new Map<string, RepositorySummary>();

  for (const item of systems.flatMap(
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
  systems: SikkerhetsmetrikkerSystemTotal[],
): string[] =>
  systems.flatMap(system => system.metrics?.notPermittedComponents ?? []);

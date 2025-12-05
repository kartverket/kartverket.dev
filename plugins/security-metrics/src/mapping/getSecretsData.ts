import {
  Repository,
  RepositorySummary,
  SecretsOverview,
} from '../typesFrontend';

export const getSecrets = (
  input: RepositorySummary[] | Repository,
): SecretsOverview[] => {
  const repos = Array.isArray(input) ? input : [input];
  return repos.map(r => ({
    componentName: r.componentName,
    alerts:
      r.secrets?.alerts?.map(a => ({
        createdAt: a.createdAt,
        summary: a.summary,
        secretValue: a.secretValue,
        htmlUrl: a.htmlUrl,
        bypassed: a.bypassed,
        bypassedBy: a.bypassedBy,
      })) ?? [],
  }));
};

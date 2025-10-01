import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import { MetricTypes } from '../utils/MetricTypes';
import { useConfig } from './getConfig';
import { SecurityChamp } from '../typesFrontend';
import { post } from '../api/client';

export const useSecurityChampionsQuery = (repositoryNames: string[]) => {
  const { config, backstageAuthApi, microsoftAuthApi, endpointUrl } = useConfig(
    MetricTypes.securityChampions,
  );

  return useQuery<SecurityChamp[], Error>({
    queryKey: ['security-champions', repositoryNames],
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );
      return post<
        { repositoryNames: string[]; entraIdToken: string },
        SecurityChamp[]
      >(endpointUrl, backstageToken, { repositoryNames, entraIdToken });
    },
    enabled: repositoryNames.length !== 0,
    staleTime: 3600000,
  });
};

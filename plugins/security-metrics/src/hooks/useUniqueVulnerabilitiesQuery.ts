import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import { MetricTypes } from '../utils/MetricTypes';
import { useConfig } from './getConfig';
import { UniqueVulnerabilitiesResponse } from '../typesFrontend';
import { post } from '../api/client';

export const uniqueVulnerabilitiesQueryKeys = {
  uniqueVulnerabilities: (entityName: string) => [
    'uniqueVulnerabilities',
    entityName,
  ],
};

export const useUniqueVulnerabilitiesQuery = (
  entityName: string,
  componentNames: string[],
  enabled: boolean,
) => {
  const { config, backstageAuthApi, microsoftAuthApi, endpointUrl } = useConfig(
    MetricTypes.uniqueVulnerabilities,
  );

  return useQuery<UniqueVulnerabilitiesResponse, Error>({
    queryKey: uniqueVulnerabilitiesQueryKeys.uniqueVulnerabilities(entityName),
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );
      endpointUrl.searchParams.set('entityName', entityName);
      return post<
        { componentNames: string[]; entraIdToken: string },
        UniqueVulnerabilitiesResponse
      >(endpointUrl, backstageToken, { componentNames, entraIdToken });
    },
    retry: 1,
    enabled: enabled && componentNames.length !== 0,
    staleTime: 3600000,
  });
};

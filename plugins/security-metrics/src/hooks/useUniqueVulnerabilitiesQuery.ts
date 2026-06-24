import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import { MetricTypes } from '../utils/MetricTypes';
import { useConfig } from './getConfig';
import { UniqueVulnerabilities } from '../typesFrontend';
import { post } from '../api/client';

const uniqueVulnerabilitiesQueryKeys = {
  overview: (entityName: string) => ['uniqueVulnerabilities', entityName],
};

export const useUniqueVulnerabilitiesQuery = (
  entityName: string,
  componentNames: string[],
  enabled: boolean,
) => {
  const { config, backstageAuthApi, microsoftAuthApi, endpointUrl } = useConfig(
    MetricTypes.uniqueVulnerabilities,
  );

  return useQuery<UniqueVulnerabilities, Error>({
    queryKey: uniqueVulnerabilitiesQueryKeys.overview(entityName),
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );
      endpointUrl.searchParams.set('entityName', entityName);
      return post<
        { componentNames: string[]; entraIdToken: string },
        UniqueVulnerabilities
      >(endpointUrl, backstageToken, { componentNames, entraIdToken });
    },
    retry: 1,
    enabled: enabled && componentNames.length !== 0,
    staleTime: 3600000,
  });
};

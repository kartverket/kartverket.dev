import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import { MetricTypes } from '../utils/MetricTypes';
import { useConfig } from './getConfig';
import { SystemSeverityCounts } from '../typesFrontend';
import { post } from '../api/client';

export const useSystemsQuery = (
  entityName: string,
  componentNames: string[],
  enabled: boolean,
) => {
  const { config, backstageAuthApi, microsoftAuthApi, endpointUrl } = useConfig(
    MetricTypes.systems,
  );

  return useQuery<SystemSeverityCounts[], Error>({
    queryKey: ['systems', entityName, [...componentNames]],
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );
      endpointUrl.searchParams.set('entityName', entityName);
      return post<
        { componentNames: string[]; entraIdToken: string },
        SystemSeverityCounts[]
      >(endpointUrl, backstageToken, { componentNames, entraIdToken });
    },
    retry: 1,
    enabled: enabled && componentNames.length !== 0,
    staleTime: 3600000,
  });
};

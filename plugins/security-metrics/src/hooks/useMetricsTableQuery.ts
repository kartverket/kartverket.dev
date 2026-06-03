import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import { MetricTypes } from '../utils/MetricTypes';
import { useConfig } from './getConfig';
import { MetricsResponse } from '../typesFrontend';
import { post } from '../api/client';

export const metricsTableQueryKeys = {
  metricsTable: (entityName: string) => ['metricsTable', entityName],
};

export const useMetricsTableQuery = (
  entityName: string,
  componentNames: string[],
) => {
  const { config, backstageAuthApi, microsoftAuthApi, endpointUrl } = useConfig(
    MetricTypes.metricsTable,
  );

  return useQuery<MetricsResponse, Error>({
    queryKey: metricsTableQueryKeys.metricsTable(entityName),
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );
      endpointUrl.searchParams.set('entityName', entityName);
      return post<
        { componentNames: string[]; entraIdToken: string },
        MetricsResponse
      >(endpointUrl, backstageToken, { componentNames, entraIdToken });
    },
    retry: 1,
    enabled: componentNames.length !== 0,
    staleTime: 3600000,
  });
};

import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import { MetricTypes } from '../utils/MetricTypes';
import { useConfig } from './getConfig';
import { AggregatedSikkerhetsmetrikker } from '../typesFrontend';
import { post } from '../api/client';

const metricsQueryKeys = {
  metrics: (entityName: string) => ['metrics', entityName],
};

export const useMetricsQuery = (
  entityName: string,
  componentNames: string[],
) => {
  const { config, backstageAuthApi, microsoftAuthApi, endpointUrl } = useConfig(
    MetricTypes.metrics,
  );

  return useQuery<AggregatedSikkerhetsmetrikker, Error>({
    queryKey: metricsQueryKeys.metrics(entityName),
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );
      endpointUrl.searchParams.set('entityName', entityName);
      return post<
        { componentNames: string[]; entraIdToken: string },
        AggregatedSikkerhetsmetrikker
      >(endpointUrl, backstageToken, { componentNames, entraIdToken });
    },
    retry: 1,
    enabled: componentNames.length !== 0,
    staleTime: 3600000,
  });
};

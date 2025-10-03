import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import { MetricTypes } from '../utils/MetricTypes';
import { useConfig } from './getConfig';
import { SikkerhetsmetrikkerSystemTotal } from '../typesFrontend';
import { post } from '../api/client';

export const metricsQueryKeys = {
  metrics: (componentNames: string[]) => ['metrics', componentNames],
};

export const useMetricsQuery = (componentNames: string[]) => {
  const { config, backstageAuthApi, microsoftAuthApi, endpointUrl } = useConfig(
    MetricTypes.metrics,
  );

  return useQuery<SikkerhetsmetrikkerSystemTotal[], Error>({
    queryKey: metricsQueryKeys.metrics(componentNames),
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );
      return post<
        { componentNames: string[]; entraIdToken: string },
        SikkerhetsmetrikkerSystemTotal[]
      >(endpointUrl, backstageToken, { componentNames, entraIdToken });
    },
    retry: 1,
    enabled: componentNames.length !== 0,
    staleTime: 3600000,
  });
};

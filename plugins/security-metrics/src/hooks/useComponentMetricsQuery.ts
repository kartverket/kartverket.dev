import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import { MetricTypes } from '../utils/MetricTypes';
import { useConfig } from './getConfig';
import { Repository } from '../typesFrontend';
import { get } from '../api/client';

export const componentMetricsQueryKeys = {
  metrics: (componentName: string) => ['metrics', componentName],
};

export const useComponentMetricsQuery = (componentName: string) => {
  const { config, backstageAuthApi, microsoftAuthApi, endpointUrl } = useConfig(
    MetricTypes.componentMetrics,
  );

  return useQuery<Repository, Error>({
    queryKey: componentMetricsQueryKeys.metrics(componentName),
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );
      endpointUrl.searchParams.set('componentName', componentName);
      return get<Repository>(endpointUrl, backstageToken, entraIdToken);
    },
    retry: 1,
    staleTime: 3600000,
  });
};

import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import { MetricTypes } from '../utils/MetricTypes';
import { useConfig } from './getConfig';
import { MetricsUpdateStatus } from '../typesFrontend';
import { get } from '../api/client';

export const useMetricsUpdateStatusQuery = () => {
  const { config, backstageAuthApi, microsoftAuthApi, endpointUrl } = useConfig(
    MetricTypes.metricsUpdateStatus,
  );

  return useQuery<MetricsUpdateStatus, Error>({
    queryKey: ['metricsUpdateStatus'],
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );
      return get<MetricsUpdateStatus>(
        endpointUrl,
        backstageToken,
        entraIdToken,
      );
    },
    retry: 1,
    staleTime: 3600000,
  });
};

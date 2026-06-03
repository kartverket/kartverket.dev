import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import { MetricTypes } from '../utils/MetricTypes';
import { useConfig } from './getConfig';
import { OverviewResponse } from '../typesFrontend';
import { post } from '../api/client';

export const overviewQueryKeys = {
  overview: (entityName: string) => ['overview', entityName],
};

export const useOverviewQuery = (
  entityName: string,
  componentNames: string[],
) => {
  const { config, backstageAuthApi, microsoftAuthApi, endpointUrl } = useConfig(
    MetricTypes.overview,
  );

  return useQuery<OverviewResponse, Error>({
    queryKey: overviewQueryKeys.overview(entityName),
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );
      endpointUrl.searchParams.set('entityName', entityName);
      return post<
        { componentNames: string[]; entraIdToken: string },
        OverviewResponse
      >(endpointUrl, backstageToken, { componentNames, entraIdToken });
    },
    retry: 1,
    enabled: componentNames.length !== 0,
    staleTime: 3600000,
  });
};

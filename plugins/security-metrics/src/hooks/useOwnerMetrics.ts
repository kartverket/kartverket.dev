import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import { MetricTypes } from '../utils/MetricTypes';
import { useConfig } from './getConfig';
import { SikkerhetsmetrikkerOwnerTotal } from '../typesFrontend';
import { post } from '../api/client';
import { useFetchComponentNamesByGroup } from './useFetchComponentNames';
import { Entity } from '@backstage/catalog-model';

type UseOwnerMetricsResult = {
  data: SikkerhetsmetrikkerOwnerTotal | undefined;
  isLoading: boolean;
  isEmpty: boolean;
  error: Error | null;
  errorTitle: string;
};

const useOwnerQuery = (entityName: string, componentNames: string[]) => {
  const { config, backstageAuthApi, microsoftAuthApi, endpointUrl } = useConfig(
    MetricTypes.ownerMetrics,
  );

  return useQuery<SikkerhetsmetrikkerOwnerTotal, Error>({
    queryKey: ['ownerMetrics', entityName, componentNames],
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );
      endpointUrl.searchParams.set('entityName', entityName);
      return post<
        { componentNames: string[]; entraIdToken: string },
        SikkerhetsmetrikkerOwnerTotal
      >(endpointUrl, backstageToken, {
        componentNames,
        entraIdToken,
      });
    },
    retry: 1,
    enabled: componentNames.length !== 0,
    staleTime: 3600000,
  });
};

export const useOwnerMetrics = (entity: Entity): UseOwnerMetricsResult => {
  const { componentNames, componentNamesIsLoading, componentNamesError } =
    useFetchComponentNamesByGroup(entity);
  const { data, isPending, error } = useOwnerQuery(
    entity.metadata.name,
    componentNames,
  );

  const isLoading =
    componentNamesIsLoading || (componentNames.length > 0 && isPending);

  const isEmpty =
    !componentNamesIsLoading &&
    !componentNamesError &&
    componentNames.length === 0;

  const combinedError = componentNamesError ?? error ?? null;
  const errorTitle = componentNamesError
    ? `Kunne ikke hente reponavn for ${entity.metadata.name}`
    : `Kunne ikke hente metrikker for ${entity.metadata.name}`;

  return {
    data,
    isLoading,
    isEmpty,
    error: combinedError,
    errorTitle,
  };
};

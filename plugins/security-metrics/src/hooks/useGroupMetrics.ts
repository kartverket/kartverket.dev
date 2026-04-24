import { Entity } from '@backstage/catalog-model';
import { AggregatedSikkerhetsmetrikker } from '../typesFrontend';
import { useFetchComponentNamesByGroup } from './useFetchComponentNames';
import { useMetricsQuery } from './useMetricsQuery';

type UseGroupMetricsResult = {
  data: AggregatedSikkerhetsmetrikker | undefined;
  isLoading: boolean;
  isEmpty: boolean;
  error: Error | null;
  errorTitle: string;
};

export const useGroupMetrics = (entity: Entity): UseGroupMetricsResult => {
  const { componentNames, componentNamesIsLoading, componentNamesError } =
    useFetchComponentNamesByGroup(entity);
  const { data, isPending, error } = useMetricsQuery(componentNames);

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

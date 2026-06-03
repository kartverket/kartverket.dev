import { Entity } from '@backstage/catalog-model';
import {
  MetricsResponse,
  UniqueVulnerabilitiesResponse,
} from '../typesFrontend';
import { useFetchComponentNamesByGroup } from './useFetchComponentNames';
import { useOverviewQuery } from './useOverviewQuery';
import { useMetricsTableQuery } from './useMetricsTableQuery';
import { useUniqueVulnerabilitiesQuery } from './useUniqueVulnerabilitiesQuery';

type UseGroupMetricsResult = {
  metricsData: MetricsResponse | undefined;
  isLoading: boolean;
  isEmpty: boolean;
  error: Error | null;
  errorTitle: string;
  componentNames: string[];
};

export const useGroupMetrics = (entity: Entity): UseGroupMetricsResult => {
  const { componentNames, componentNamesIsLoading, componentNamesError } =
    useFetchComponentNamesByGroup(entity);

  const { isPending: overviewPending, error: overviewError } = useOverviewQuery(
    entity.metadata.name,
    componentNames,
  );

  const {
    data: metricsData,
    isPending: metricsPending,
    error: metricsError,
  } = useMetricsTableQuery(entity.metadata.name, componentNames);

  const isLoading =
    componentNamesIsLoading ||
    (componentNames.length > 0 && (overviewPending || metricsPending));

  const isEmpty =
    !componentNamesIsLoading &&
    !componentNamesError &&
    componentNames.length === 0;

  const combinedError =
    componentNamesError ?? overviewError ?? metricsError ?? null;
  const errorTitle = componentNamesError
    ? `Kunne ikke hente reponavn for ${entity.metadata.name}`
    : `Kunne ikke hente metrikker for ${entity.metadata.name}`;

  return {
    metricsData,
    isLoading,
    isEmpty,
    error: combinedError,
    errorTitle,
    componentNames,
  };
};

type UseUniqueVulnerabilitiesResult = {
  data: UniqueVulnerabilitiesResponse | undefined;
  isLoading: boolean;
  error: Error | null;
};

export const useGroupUniqueVulnerabilities = (
  entityName: string,
  componentNames: string[],
  enabled: boolean,
): UseUniqueVulnerabilitiesResult => {
  const { data, isPending, error } = useUniqueVulnerabilitiesQuery(
    entityName,
    componentNames,
    enabled,
  );

  return {
    data,
    isLoading: enabled && componentNames.length > 0 && isPending,
    error: error ?? null,
  };
};

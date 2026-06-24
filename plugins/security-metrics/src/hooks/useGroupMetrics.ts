import { Entity } from '@backstage/catalog-model';
import { OverviewResponse, UniqueVulnerabilities } from '../typesFrontend';
import { useFetchComponentNamesByGroup } from './useFetchComponentNames';
import { useOverviewQuery } from './useOverviewQuery';
import { useUniqueVulnerabilitiesQuery } from './useUniqueVulnerabilitiesQuery.ts';

type UseGroupMetricsResult = {
  data: OverviewResponse | undefined;
  componentNames: string[];
  uniqueVulnerabilitiesData: UniqueVulnerabilities | undefined;
  isUniqueVulnerabilitiesLoading: boolean;
  uniqueVulnerabilitiesError: Error | null;
  isLoading: boolean;
  isEmpty: boolean;
  error: Error | null;
  errorTitle: string;
};

export const useGroupMetrics = (
  entity: Entity,
  fetchUniqueVulnerabilities = false,
): UseGroupMetricsResult => {
  const { componentNames, componentNamesIsLoading, componentNamesError } =
    useFetchComponentNamesByGroup(entity);
  const { data, isPending, error } = useOverviewQuery(
    entity.metadata.name,
    componentNames,
  );
  const {
    data: uniqueVulnerabilitiesData,
    isPending: isUniqueVulnerabilitiesLoading,
    error: uniqueVulnerabilitiesError,
  } = useUniqueVulnerabilitiesQuery(
    entity.metadata.name,
    componentNames,
    fetchUniqueVulnerabilities,
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
    componentNames,
    uniqueVulnerabilitiesData,
    isUniqueVulnerabilitiesLoading,
    uniqueVulnerabilitiesError,
    isLoading,
    isEmpty,
    error: combinedError,
    errorTitle,
  };
};

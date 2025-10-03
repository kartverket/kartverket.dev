import { Entity } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useQuery } from '@tanstack/react-query';

export const useEntitiesQuery = (refs: string[]) => {
  const catalogApi = useApi(catalogApiRef);
  return useQuery({
    queryKey: ['entities-by-refs', ...refs],
    queryFn: async () => {
      const { items } = await catalogApi.getEntitiesByRefs({
        entityRefs: refs,
      });
      return items.filter(Boolean) as Entity[];
    },
    enabled: refs.length > 0,
  });
};

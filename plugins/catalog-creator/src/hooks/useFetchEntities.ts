import { Control, useWatch } from 'react-hook-form';
import { formSchema } from '../schemas/formSchema';
import z from 'zod/v4';
import { useAsync } from 'react-use';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { useMemo } from 'react';

export const useFetchEntities = (
  control: Control<z.infer<typeof formSchema>>,
  entityKind: string,
) => {
  const catalogApi = useApi(catalogApiRef);

  const fetchEntities = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: { kind: entityKind },
    });

    return results.items as Entity[];
  }, [catalogApi]);

  const formEntities = useWatch({
    control,
    name: 'entities',
  });

  const combined: Entity[] = useMemo(() => {
    const fromFormEntities = [
      ...formEntities.flatMap(e => {
        if (e.kind === entityKind && e.name !== '') {
          return {
            apiVersion: 'backstage.io/v1alpha1',
            kind: e.kind,
            metadata: {
              name: e.name,
            },
            spec: {
              title: e.title,
            },
          };
        }
        return [];
      }),
    ];
    const fetchedEntities = [
      ...(fetchEntities.value
        ? fetchEntities.value.filter(e => {
            if (
              fromFormEntities
                .map(entity => `${entity.kind}:default/${entity.metadata.name}`)
                .includes(`${e.kind}:default/${e.metadata.name}`)
            ) {
              return false;
            }
            return true;
          })
        : []),
    ];
    return [...fromFormEntities, ...fetchedEntities];
  }, [fetchEntities.value, formEntities, entityKind]);

  return {
    loading: fetchEntities.loading,
    error: fetchEntities.error,
    value: combined,
  };
};

import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import {
  Entity,
  parseEntityRef,
  RELATION_HAS_PART,
  RELATION_OWNER_OF,
  RELATION_PARENT_OF,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { getChildRefs } from '../utils/getChildRefs';
import {
  isDocumentationType,
  isExperimentalLifecycle,
} from '../components/utils';
import { useQuery } from '@tanstack/react-query';

const REPOSITORY_ENTITY_KIND = 'Component';
const HIGHER_LEVEL_ENTITIES = ['Group', 'Domain', 'System'];
const HIERARCHY_RELATION_TYPES = new Set([
  RELATION_OWNER_OF,
  RELATION_PARENT_OF,
]);

const isEntity = (entity: Entity | undefined): entity is Entity => !!entity;

export const useFetchComponentNamesByGroup = (rootGroupRef: Entity) => {
  const catalog = useApi(catalogApiRef);

  const getAllComponentNames = async (
    initialRefs: string[],
  ): Promise<string[]> => {
    const visited = new Set<string>();
    const componentNames = new Set<string>();
    const queue = [...initialRefs];

    while (queue.length > 0) {
      const batch = queue.splice(0).filter(ref => !visited.has(ref));
      if (batch.length === 0) continue;

      batch.forEach(ref => visited.add(ref));

      const entities = (
        await catalog.getEntitiesByRefs({ entityRefs: batch })
      ).items.filter(isEntity);

      for (const entity of entities) {
        if (
          entity.kind === REPOSITORY_ENTITY_KIND &&
          !isExperimentalLifecycle(entity.spec?.lifecycle) &&
          !isDocumentationType(entity.spec?.type)
        ) {
          componentNames.add(entity.metadata.name);
          continue;
        }

        if (!HIGHER_LEVEL_ENTITIES.includes(entity.kind)) continue;

        for (const relation of entity.relations ?? []) {
          if (HIERARCHY_RELATION_TYPES.has(relation.type)) {
            queue.push(relation.targetRef);
          }
        }
      }
    }

    return [...componentNames].sort((a, b) => a.localeCompare(b));
  };

  const { data, isPending, error } = useQuery<string[]>({
    queryKey: ['group-components', stringifyEntityRef(rootGroupRef)],
    queryFn: async () => {
      const rootGroupChildren = getChildRefs([rootGroupRef]);
      const names = await getAllComponentNames(rootGroupChildren);
      return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
    },
  });

  return {
    componentNames: data ?? [],
    componentNamesIsLoading: isPending,
    componentNamesError: error,
  };
};

export const useFetchComponentNamesFromSystem = (system: Entity) => {
  const catalog = useApi(catalogApiRef);

  const componentRefs = Array.from(
    new Set(
      (system.relations ?? [])
        .filter(r => r.type === RELATION_HAS_PART)
        .map(r => r.targetRef)
        .filter(
          ref => (parseEntityRef(ref).kind ?? '').toLowerCase() === 'component',
        ),
    ),
  );

  const { data, isPending, error } = useQuery<string[]>({
    queryKey: ['system-components', stringifyEntityRef(system)],
    queryFn: async () => {
      if (componentRefs.length === 0) return [];
      const result = await catalog.getEntitiesByRefs({
        entityRefs: componentRefs,
      });
      return result.items
        .filter(isEntity)
        .map(entity => entity.metadata.name)
        .sort((a, b) => a.localeCompare(b));
    },
  });

  return {
    componentNames: data ?? [],
    componentNamesIsLoading: isPending,
    componentNamesError: error,
  };
};

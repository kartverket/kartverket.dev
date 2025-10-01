import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import {
  Entity,
  RELATION_DEPENDS_ON,
  RELATION_HAS_PART,
  RELATION_OWNER_OF,
  RELATION_PARENT_OF,
} from '@backstage/catalog-model';
import { getChildRefs } from '../utils/getChildRefs';
import { isExperimentalLifecycle } from '../components/utils';
import { useQuery } from '@tanstack/react-query';

const REPOSITORY_ENTITY_KIND = 'Component';
const HIGHER_LEVEL_ENTITIES = ['Group', 'Domain', 'System'];

const isEntity = (entity: Entity | undefined): entity is Entity => !!entity;

export const useFetchComponentNamesByGroup = (rootGroupRef: Entity) => {
  const rootgroupchildren = getChildRefs([rootGroupRef]);
  const catalog = useApi(catalogApiRef);

  const getAllComponentNamesByRecursion = async (
    entityRefs: string[],
    repositoryEntities: string[] = [],
    visitedRefs: Set<string> = new Set(),
  ): Promise<string[]> => {
    const newGroupRefs = entityRefs.filter(ref => !visitedRefs.has(ref));
    if (newGroupRefs.length === 0) return repositoryEntities;

    newGroupRefs.forEach(ref => visitedRefs.add(ref));

    const resultEntities = (
      await catalog.getEntitiesByRefs({
        entityRefs: newGroupRefs,
      })
    ).items.filter(isEntity);

    const childrenRefs: string[] = [];

    resultEntities.forEach(item => {
      if (
        item.kind === REPOSITORY_ENTITY_KIND &&
        !isExperimentalLifecycle(item.spec?.lifecycle)
      ) {
        repositoryEntities.push(item.metadata.title ?? item.metadata.name);
      } else if (HIGHER_LEVEL_ENTITIES.includes(item.kind)) {
        item.relations?.forEach(relation => {
          if (
            [
              RELATION_OWNER_OF,
              RELATION_HAS_PART,
              RELATION_PARENT_OF,
              RELATION_DEPENDS_ON,
            ].includes(relation.type)
          ) {
            childrenRefs.push(relation.targetRef);
          }
        });
      }
    });

    if (!childrenRefs || childrenRefs.length === 0) {
      return repositoryEntities;
    }

    return getAllComponentNamesByRecursion(
      childrenRefs,
      repositoryEntities,
      visitedRefs,
    );
  };

  const { data, isPending, error } = useQuery<string[]>({
    queryKey: ['group-components', rootGroupRef],
    queryFn: async () => {
      const names = await getAllComponentNamesByRecursion(rootgroupchildren);
      return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
    },
  });

  return {
    componentNames: data ?? [],
    componentNamesIsLoading: isPending,
    componentNamesError: error,
  };
};

import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import { SecurityChampion } from './SecurityChampion';
import { ErrorBanner } from './ErrorBanner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Entity,
  RELATION_DEPENDS_ON,
  RELATION_HAS_PART,
  RELATION_OWNER_OF,
  RELATION_PARENT_OF,
} from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const queryClient = new QueryClient();

const REPOSITORY_ENTITY_KIND = 'Component';
const HIGHER_LEVEL_ENTITIES = ['Group', 'Domain', 'System'];

const isEntity = (entity: Entity | undefined): entity is Entity => !!entity;

export const SecurityChampionCard = () => {
  const catalog = useApi(catalogApiRef);
  const { entity } = useEntity();

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
      if (item.kind === REPOSITORY_ENTITY_KIND) {
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

  const {
    value: componentNames,
    loading,
    error,
  } = useAsync(async () => {
    if (entity.kind === 'System') {
      return entity.relations
        ?.filter(rel =>
          rel.targetRef.startsWith(REPOSITORY_ENTITY_KIND.toLowerCase()),
        )
        .map(rel => rel.targetRef.split('/')[1]) as string[];
    } else if (entity.kind === 'Component') {
      return [entity.metadata.name];
    } else if (entity.kind === 'Group' || entity.kind === 'Domain') {
      const groupRef = `${entity.kind.toLowerCase()}:${entity.metadata.namespace}/${entity.metadata.name}`;
      return await getAllComponentNamesByRecursion([groupRef]);
    }
    return [];
  }, [entity]);

  if (loading)
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );

  if (error) {
    return <ErrorBanner errorMessage="Kunne ikke hente Security Champions" />;
  }

  if (!componentNames || componentNames.length === 0) {
    return (
      <QueryClientProvider client={queryClient}>
        <SecurityChampion repositoryNames={['']} />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SecurityChampion repositoryNames={componentNames} />
    </QueryClientProvider>
  );
};

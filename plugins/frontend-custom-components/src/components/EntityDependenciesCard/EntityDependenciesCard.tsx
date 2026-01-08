import {
  InfoCardVariants,
  InfoCard,
  Progress,
  ResponseErrorPanel,
  Link,
} from '@backstage/core-components';
import { TableColumn } from '@backstage/core-components';
import {
  catalogApiRef,
  EntityRefLink,
  EntityTable,
  useEntity,
} from '@backstage/plugin-catalog-react';
import {
  Entity,
  RELATION_PARENT_OF,
  RELATION_DEPENDS_ON,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import Typography from '@material-ui/core/Typography';
import { useAsync } from 'react-use';

export type EntityDependenciesCardProps = {
  variant?: InfoCardVariants;
  title?: string;
};

const ENTITY_KIND = ['System', 'Component', 'Resource', 'Api'];
const HIGHER_LEVEL_ENTITIES = ['Function'];

export const EntityDependenciesCard = (props: EntityDependenciesCardProps) => {
  const { variant = 'gridItem', title = 'Dependencies' } = props;
  const catalog = useApi(catalogApiRef);
  const { entity } = useEntity();

  const isEntity = (ent: Entity | undefined): ent is Entity => !!ent;

  const getAllDependencyEntitiesByRecursion = async (
    entityRefs: string[],
    dependencyEntities: Entity[] = [],
    visitedRefs: Set<string> = new Set(),
  ): Promise<Entity[]> => {
    const newEntityRefs = entityRefs.filter(ref => !visitedRefs.has(ref));

    if (newEntityRefs.length === 0) {
      return dependencyEntities;
    }

    newEntityRefs.forEach(ref => visitedRefs.add(ref));

    const resultEntities = (
      await catalog.getEntitiesByRefs({
        entityRefs: newEntityRefs,
      })
    ).items.filter(isEntity);

    const childrenRefs: string[] = [];

    resultEntities.forEach(item => {
      if (ENTITY_KIND.includes(item.kind)) {
        dependencyEntities.push(item);
      } else if (HIGHER_LEVEL_ENTITIES.includes(item.kind)) {
        item.relations?.forEach(relation => {
          if (relation.type === RELATION_PARENT_OF) {
            childrenRefs.push(relation.targetRef);
          }
          if (relation.type === RELATION_DEPENDS_ON) {
            childrenRefs.push(relation.targetRef);
          }
        });
      }
    });

    if (!childrenRefs || childrenRefs.length === 0) {
      return dependencyEntities;
    }

    return getAllDependencyEntitiesByRecursion(
      childrenRefs,
      dependencyEntities,
      visitedRefs,
    );
  };

  const getAllDependencyEntities = async (): Promise<Entity[]> => {
    const directEntityRefs: string[] = [];
    entity.relations?.forEach(relation => {
      if (relation.type === RELATION_DEPENDS_ON) {
        directEntityRefs.push(relation.targetRef);
      }
    });

    const childFunctionRefs: string[] = [];
    entity.relations?.forEach(relation => {
      if (relation.type === RELATION_PARENT_OF) {
        childFunctionRefs.push(relation.targetRef);
      }
    });

    const childEntities =
      childFunctionRefs.length > 0
        ? await getAllDependencyEntitiesByRecursion(childFunctionRefs)
        : [];

    const directEntities =
      directEntityRefs.length > 0
        ? (
            await catalog.getEntitiesByRefs({ entityRefs: directEntityRefs })
          ).items.filter(isEntity)
        : [];

    const allEntityDependencies = [...directEntities, ...childEntities];
    const uniqueEntityDependencies = Array.from(
      new Map(
        allEntityDependencies.map(item => [stringifyEntityRef(item), item]),
      ).values(),
    );

    return uniqueEntityDependencies;
  };

  const {
    value: dependencyEntities,
    loading,
    error,
  } = useAsync(async () => {
    return await getAllDependencyEntities();
  }, [entity]);

  const entityColumns: TableColumn<Entity>[] = [
    {
      title: 'Name',
      field: 'metadata.name',
      highlight: true,
      render: (ent: Entity) => (
        <EntityRefLink entityRef={ent} defaultKind={ent.kind.toLowerCase()} />
      ),
    },
    {
      title: 'Kind',
      field: 'kind',
      highlight: false,
      render: (ent: Entity) => <p>{ent.kind}</p>,
    },
    EntityTable.columns.createOwnerColumn(),
    EntityTable.columns.createMetadataDescriptionColumn(),
  ];

  const EntityHelpLink: string =
    'https://backstage.io/docs/features/software-catalog/';

  if (loading) {
    return (
      <InfoCard variant={variant} title={title}>
        <Progress />
      </InfoCard>
    );
  }

  if (error) {
    return (
      <InfoCard variant={variant} title={title}>
        <ResponseErrorPanel error={error} />
      </InfoCard>
    );
  }

  return (
    <EntityTable
      title={title}
      variant={variant}
      emptyContent={
        <div style={{ textAlign: 'center' }}>
          <Typography variant="body1">
            No entities found that this function or its child functions depend
            on.
          </Typography>
          <Typography variant="body2">
            <Link to={EntityHelpLink} externalLinkIcon>
              Learn more about entities
            </Link>
          </Typography>
        </div>
      }
      columns={entityColumns}
      entities={dependencyEntities || []}
    />
  );
};

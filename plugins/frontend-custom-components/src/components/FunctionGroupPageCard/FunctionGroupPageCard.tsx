import {
  InfoCardVariants,
  InfoCard,
  Progress,
  ResponseErrorPanel,
  Link,
  Table,
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
  stringifyEntityRef,
  RELATION_DEPENDENCY_OF,
  RELATION_OWNER_OF,
  RELATION_DEPENDS_ON,
} from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import Typography from '@material-ui/core/Typography';
import { useAsync } from 'react-use';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { functionGroupPageTranslationRef } from './translation';

export type FunctionGroupPageCardProps = {
  variant?: InfoCardVariants;
};

export const FunctionGroupPageCard = (props: FunctionGroupPageCardProps) => {
  const { variant = 'gridItem' } = props;
  const catalog = useApi(catalogApiRef);
  const { entity } = useEntity();
  const { t } = useTranslationRef(functionGroupPageTranslationRef);

  const isEntity = (ent: Entity | undefined): ent is Entity => !!ent;

  const getAllOwnedEntities = async (): Promise<{
    functions: Entity[];
    ownedEntitiesMap: Map<string, Entity>;
  }> => {
    const ownedEntitiesRefs: string[] = [];

    entity.relations?.forEach(relation => {
      if (
        relation.type === RELATION_OWNER_OF &&
        !relation.targetRef.includes('function')
      ) {
        ownedEntitiesRefs.push(relation.targetRef);
      }
    });

    if (ownedEntitiesRefs.length === 0) {
      return { functions: [], ownedEntitiesMap: new Map() };
    }

    const ownedEntities = (
      await catalog.getEntitiesByRefs({
        entityRefs: ownedEntitiesRefs,
      })
    ).items.filter(isEntity);

    const ownedEntitiesMap = new Map(
      ownedEntities.map(e => [stringifyEntityRef(e), e]),
    );

    const functionRefs: string[] = [];

    ownedEntities.forEach(ownedEntity => {
      ownedEntity.relations?.forEach(relation => {
        if (
          relation.type === RELATION_DEPENDENCY_OF &&
          relation.targetRef.toLowerCase().includes('function')
        ) {
          functionRefs.push(relation.targetRef);
        }
      });
    });

    if (functionRefs.length === 0) {
      return { functions: [], ownedEntitiesMap };
    }

    const functionEntities = (
      await catalog.getEntitiesByRefs({
        entityRefs: functionRefs,
      })
    ).items.filter(isEntity);

    const uniqueFunctions = Array.from(
      new Map(
        functionEntities.map(item => [stringifyEntityRef(item), item]),
      ).values(),
    );

    return { functions: uniqueFunctions, ownedEntitiesMap };
  };

  const {
    value: result,
    loading,
    error,
  } = useAsync(async () => {
    return await getAllOwnedEntities();
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
    EntityTable.columns.createOwnerColumn(),

    {
      title: 'depends on',
      field: 'relations',
      highlight: false,
      render: (ent: Entity) => {
        const relatedEntities = ent.relations
          ?.filter(rel => rel.type === RELATION_DEPENDS_ON)
          .map(rel => result?.ownedEntitiesMap.get(rel.targetRef))
          .filter(isEntity);

        if (!relatedEntities || relatedEntities.length === 0) {
          return <Typography variant="body2">-</Typography>;
        }

        return (
          <div>
            {relatedEntities.map((relEntity, idx) => (
              <div key={idx}>
                <EntityRefLink
                  entityRef={relEntity}
                  defaultKind={relEntity.kind.toLowerCase()}
                />
              </div>
            ))}
          </div>
        );
      },
    },

    EntityTable.columns.createMetadataDescriptionColumn(),
  ];

  const EntityHelpLink: string =
    'https://backstage.io/docs/features/software-catalog/';

  if (loading) {
    return (
      <InfoCard variant={variant} title={t('functioncard.title')}>
        <Progress />
      </InfoCard>
    );
  }

  if (error) {
    return (
      <InfoCard variant={variant} title={t('functioncard.title')}>
        <ResponseErrorPanel error={error} />
      </InfoCard>
    );
  }

  return (
    <Table
      title={t('functioncard.title')}
      subtitle={t('functioncard.subtitle')}
      options={{ search: true, paging: true }}
      data={result?.functions || []}
      columns={entityColumns}
      emptyContent={
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <Typography variant="body1">
            No functions found that is dependent on this{' '}
            {entity.kind.toLowerCase()}
          </Typography>
          <Typography variant="body2">
            <Link to={EntityHelpLink} externalLinkIcon>
              Learn more about entities
            </Link>
          </Typography>
        </div>
      }
    />
  );
};

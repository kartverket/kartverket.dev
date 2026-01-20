import { EntityRelationWarning } from '@backstage/plugin-catalog';
import { useEntity } from '@backstage/plugin-catalog-react';
import { CatalogCreatorPage } from '@kartverket/backstage-plugin-catalog-creator';

export const EntityCatalogCreatorWrapper = ({
  createFunction = false,
}: {
  createFunction?: boolean;
}) => {
  const { entity } = useEntity();

  // Extract git URL from entity metadata
  const sourceLocation =
    entity.metadata.annotations?.['backstage.io/managed-by-location'];

  // Remove 'url:' prefix if it exists in source-location
  let gitUrl = sourceLocation;
  if (gitUrl && gitUrl.startsWith('url:')) {
    gitUrl = gitUrl.substring(4);
  }

  return (
    <>
      <EntityRelationWarning />
      <CatalogCreatorPage
        docsLink="/docs/default/Component/kartverket.dev"
        originLocation={gitUrl}
        entityKind={entity.kind}
        entityName={entity.metadata.name}
        createFunction={createFunction}
      />
    </>
  );
};

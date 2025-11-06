import { useEntity } from '@backstage/plugin-catalog-react';
import { CatalogCreatorPage } from '@kartverket/backstage-plugin-catalog-creator';

export const EntityCatalogCreatorWrapper = () => {
  const { entity } = useEntity();

  // Extract git URL from entity metadata
  const sourceLocation =
    entity.metadata.annotations?.['backstage.io/source-location'];

  // Remove 'url:' prefix if it exists in source-location
  let gitUrl = sourceLocation;
  if (gitUrl && gitUrl.startsWith('url:')) {
    gitUrl = gitUrl.substring(4);
  }

  // Remove /tree/main/ or /tree/main suffix from the end
  if (gitUrl && gitUrl.includes('/tree/main')) {
    gitUrl = gitUrl.replace(/\/tree\/main\/?$/, '');
  }

  return <CatalogCreatorPage gitUrl={gitUrl} />;
};

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

  // Only remove /tree/main if it's at the end without any additional path
  // This preserves file-specific URLs but cleans up repository root URLs
  if (gitUrl && gitUrl.match(/\/tree\/main\/?$/)) {
    gitUrl = gitUrl.replace(/\/tree\/main\/?$/, '');
  }

  return <CatalogCreatorPage gitUrl={gitUrl} />;
};

import { createDevApp } from '@backstage/dev-utils';
import { catalogCreatorPlugin, CatalogCreatorPage } from '../src/plugin';

createDevApp()
  .registerPlugin(catalogCreatorPlugin)
  .addPage({
    element: <CatalogCreatorPage />,
    title: 'Root Page',
    path: '/catalog-creator',
  })
  .render();

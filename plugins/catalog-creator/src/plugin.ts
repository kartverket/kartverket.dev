import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const catalogCreatorPlugin = createPlugin({
  id: 'catalog-creator',
  routes: {
    root: rootRouteRef,
  },
});

export const CatalogCreatorPage = catalogCreatorPlugin.provide(
  createRoutableExtension({
    name: 'CatalogCreatorPage',
    component: () =>
      import('./components/CatalogCreatorPage').then(m => m.CatalogCreatorPage),
    mountPoint: rootRouteRef,
  }),
);

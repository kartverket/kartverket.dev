import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const regelrettSchemasPlugin = createPlugin({
  id: 'regelrett-schemas',
  routes: {
    root: rootRouteRef,
  },
});

export const RegelrettSchemasPage = regelrettSchemasPlugin.provide(
  createRoutableExtension({
    name: 'RegelrettSchemasPage',
    component: () =>
      import('./components/RegelrettCard').then(m => m.RegelrettCard),
    mountPoint: rootRouteRef,
  }),
);

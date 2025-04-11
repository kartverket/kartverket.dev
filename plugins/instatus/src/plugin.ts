import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const instatusPlugin = createPlugin({
  id: 'instatus',
  routes: {
    root: rootRouteRef,
  },
});

export const InstatusPage = instatusPlugin.provide(
  createRoutableExtension({
    name: 'InstatusPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);

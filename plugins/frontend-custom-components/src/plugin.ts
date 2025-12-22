import { createPlugin } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const frontendCustomComponentsPlugin = createPlugin({
  id: 'frontend-custom-components',
  routes: {
    root: rootRouteRef,
  },
});

import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const daskOnboardingPlugin = createPlugin({
  id: 'dask-onboarding',
  routes: {
    root: rootRouteRef,
  },
});

export const DaskOnboardingPage = daskOnboardingPlugin.provide(
  createRoutableExtension({
    name: 'DaskOnboardingPage',
    component: () =>
      import('./components/Onboarding').then(m => m.OnboardingComponent),
    mountPoint: rootRouteRef,
  }),
);

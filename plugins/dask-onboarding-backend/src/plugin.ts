import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';

/**
 * daskOnboardingBackendPlugin backend plugin
 *
 * @public
 */
export const daskOnboardingBackendPlugin = createBackendPlugin({
  pluginId: 'dask-onboarding-backend',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        catalog: catalogServiceRef,
      },
      async init({ httpRouter }) {
        httpRouter.use(
          await createRouter({  }),
        );
        httpRouter.addAuthPolicy({
            path: '/',
            allow: 'unauthenticated',
          });
      },
    });
  },
});

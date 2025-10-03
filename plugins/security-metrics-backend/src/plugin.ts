import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './services/ApiService/router';

/**
 * securityMetricBackendPlugin backend plugin
 *
 * @public
 */
export const securityMetricBackendPlugin = createBackendPlugin({
  pluginId: 'security-metrics',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        auth: coreServices.auth,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
      },
      async init({ httpRouter, auth, logger, config }) {
        httpRouter.use(
          await createRouter({
            auth,
            logger,
            config,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '/proxy',
          allow: 'unauthenticated',
        });
      },
    });
  },
});

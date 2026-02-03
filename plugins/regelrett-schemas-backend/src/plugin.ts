import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';

/**
 * securityMetricBackendPlugin backend plugin
 *
 * @public
 */
export const RegelrettSchemaPlugin = createBackendPlugin({
  pluginId: 'regelrett-schemas',
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
          (await createRouter({
            auth,
            logger,
            config,
          })) as any,
        );
        httpRouter.addAuthPolicy({
          path: '/proxy',
          allow: 'unauthenticated',
        });
      },
    });
  },
});

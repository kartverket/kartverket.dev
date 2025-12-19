import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './services/ApiService/router';

/**
 * regelrettSchemasBackendPlugin backend plugin
 *
 * @public
 */
export const regelrettSchemasBackendPlugin = createBackendPlugin({
  pluginId: 'regelrett-schemas',
  register(env) {
    env.registerInit({
      deps: {
        auth: coreServices.auth,
        httpRouter: coreServices.httpRouter,
      },
      async init({ auth, httpRouter }) {
        httpRouter.use(
          await createRouter({
            auth,
          }),
        );
      },
    });
  },
});

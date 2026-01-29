import {
  coreServices,
  createBackendPlugin,
  resolvePackagePath,
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
        database: coreServices.database,
      },
      async init({ httpRouter, auth, logger, config, database }) {
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
        const client = await database.getClient();
        const migrationsDir = resolvePackagePath(
          '@internal/backstage-plugin-regelrett-schemas-backend',
          'migrations',
        );
        if (!database.migrations?.skip) {
          await client.migrate.latest({
            directory: migrationsDir,
          });
        }
      },
    });
  },
});

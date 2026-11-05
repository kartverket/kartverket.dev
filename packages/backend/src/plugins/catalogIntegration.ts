import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { CatalogClient } from '@backstage/catalog-client';
import express from 'express';

const CATALOG_BATCH_SIZE = 500;

export const catalogIntegrationPlugin = createBackendPlugin({
  pluginId: 'catalog-integration',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        auth: coreServices.auth,
        discovery: coreServices.discovery,
        logger: coreServices.logger,
      },
      async init({ httpRouter, auth, discovery, logger }) {
        const catalogApi = new CatalogClient({ discoveryApi: discovery });
        const router = express.Router();

        router.get('/components', async (_request, response) => {
          try {
            const { token } = await auth.getPluginRequestToken({
              onBehalfOf: await auth.getOwnServiceCredentials(),
              targetPluginId: 'catalog',
            });

            const items: {
              repository: string | null;
              componentName: string;
              owner: unknown;
              namespace: string;
            }[] = [];
            let offset = 0;
            let hasMore = true;

            while (hasMore) {
              const result = await catalogApi.getEntities(
                {
                  filter: { kind: 'Component' },
                  fields: [
                    'metadata.name',
                    'metadata.namespace',
                    'metadata.annotations.github.com/project-slug',
                    'spec.owner',
                  ],
                  limit: CATALOG_BATCH_SIZE,
                  offset,
                },
                { token },
              );

              items.push(
                ...result.items.map(entity => ({
                  repository:
                    entity.metadata.annotations?.['github.com/project-slug'] ??
                    null,
                  componentName: entity.metadata.name,
                  owner: entity.spec?.owner ?? null,
                  namespace: entity.metadata.namespace ?? 'default',
                })),
              );

              hasMore = result.items.length === CATALOG_BATCH_SIZE;
              offset += result.items.length;
            }

            response.json({ items });
          } catch (error) {
            const message =
              error instanceof Error ? error.message : String(error);
            logger.error('Catalog integration request failed', {
              error: message,
            });
            response.status(500).json({
              error: {
                name: 'CatalogIntegrationError',
                message: 'Catalog integration request failed',
              },
            });
          }
        });
        httpRouter.use(router);
      },
    });
  },
});

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { CatalogClient } from '@backstage/catalog-client';
import express from 'express';

const CATALOG_BATCH_SIZE = 500;

function getRepository(annotations: Record<string, string> | undefined) {
  const projectSlug = annotations?.['github.com/project-slug'];
  if (projectSlug) {
    return projectSlug;
  }

  const location = annotations?.['backstage.io/managed-by-location'];
  if (!location?.startsWith('url:')) {
    return null;
  }

  const target = location.slice('url:'.length);
  if (!URL.canParse(target)) {
    return null;
  }

  const url = new URL(target);
  const [, owner, repo] = url.pathname.split('/');
  return owner && repo ? `${owner}/${repo}` : null;
}

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
              owner: string;
              type: string;
            }[] = [];
            let offset = 0;
            let hasMore = true;

            while (hasMore) {
              const result = await catalogApi.getEntities(
                {
                  filter: { kind: 'Component' },
                  fields: [
                    'metadata.name',
                    'spec.type',
                    'metadata.annotations',
                    'spec.owner',
                  ],
                  limit: CATALOG_BATCH_SIZE,
                  offset,
                },
                { token },
              );

              items.push(
                ...result.items.map(entity => ({
                  repository: getRepository(entity.metadata.annotations),
                  componentName: entity.metadata.name,
                  type:
                    typeof entity.spec?.type === 'string'
                      ? entity.spec.type
                      : 'unknown',
                  owner:
                    typeof entity.spec?.owner === 'string'
                      ? entity.spec.owner
                      : 'unknown',
                })),
              );

              hasMore = result.items.length === CATALOG_BATCH_SIZE;
              offset += result.items.length;
            }

            response.json({
              componentCount: items.length,
              items,
            });
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

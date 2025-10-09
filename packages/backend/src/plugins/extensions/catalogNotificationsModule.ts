import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { notificationService } from '@backstage/plugin-notifications-node';
import { CatalogApi, CatalogClient } from '@backstage/catalog-client';

import { Entity } from '@backstage/catalog-model';

export const catalogNotificationsModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'error-monitor',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        discovery: coreServices.discovery,
        auth: coreServices.auth,
        notificationService: notificationService,
      },
      async init({
        logger,
        scheduler,
        discovery,
        auth,
        notificationService: notification,
      }) {
        async function getRelationWarnings(
          entity: Entity,
          catalogApi: CatalogApi,
          token: string,
        ) {
          const entityRefRelations = entity.relations?.map(
            relation => relation.targetRef,
          );
          if (
            !entityRefRelations ||
            entityRefRelations?.length < 1 ||
            entityRefRelations.length > 100
          ) {
            return [];
          }

          const relatedEntities = await catalogApi.getEntitiesByRefs(
            {
              entityRefs: entityRefRelations,
              fields: ['kind', 'metadata.name', 'metadata.namespace'],
            },
            { token },
          );

          return entityRefRelations.filter(
            (_, index) => relatedEntities.items[index] === undefined,
          );
        }

        await scheduler.scheduleTask({
          id: 'catalog-error-monitor',
          frequency: { minutes: 30 },
          timeout: { minutes: 3 },
          fn: async () => {
            const { token } = await auth.getPluginRequestToken({
              onBehalfOf: await auth.getOwnServiceCredentials(),
              targetPluginId: 'catalog',
            });

            const catalogClient = new CatalogClient({
              discoveryApi: discovery,
            });

            try {
              const { items: entities } = await catalogClient.getEntities(
                {
                  filter: [
                    {
                      kind: [
                        'Component',
                        'Domain',
                        'System',
                        'Resource',
                        'Template',
                        'Location',
                        'API',
                      ],
                    },
                  ],
                },
                { token },
              );

              for (const entity of entities) {
                const relationWarnings = await getRelationWarnings(
                  entity,
                  catalogClient,
                  token,
                );
                let entityNamespace = 'default';
                let entityOwner = '';
                if (entity.kind === 'Group') {
                  entityOwner = entity.metadata.name;
                  entityNamespace = entity.metadata.namespace
                    ? entity.metadata.namespace
                    : 'default';
                  logger.error(`Entityname på group: ${entity.metadata.name}`);
                } else {
                  entityOwner = entity.spec?.owner
                    ? (entity.spec.owner as string)
                    : 'skvis';
                }

                const entityLink = `/catalog/${entityNamespace}/${entity.kind}/${entity.metadata.name}`;

                const notificationScope = `${entity.metadata.name}${relationWarnings.join()}`;

                if (relationWarnings.length > 0) {
                  notification.send({
                    recipients: {
                      type: 'entity',
                      entityRef: `group:default/${entityOwner}`,
                    },
                    payload: {
                      title: `Relation error: ${entity.metadata.name}`,
                      description: `This entity has relations to other entities, which can't be found in the catalog.
                                    Entities not found are: ${relationWarnings.join('')}`,
                      severity: 'high',
                      link: entityLink,
                      scope: notificationScope,
                    },
                  });
                }
              }
            } catch (error) {
              logger.error('Failed to check catalog for errors:');
            }
          },
        });
      },
    });
  },
});

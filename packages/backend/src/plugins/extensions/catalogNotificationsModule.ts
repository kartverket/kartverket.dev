import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { notificationService } from '@backstage/plugin-notifications-node';
import { CatalogClient } from '@backstage/catalog-client';
import { DatabaseManager } from '@backstage/backend-defaults/database';

type MissingRelationTarget = {
  ref: string;
  target_ref: string;
  owner_ref: string | null;
};

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
        db: coreServices.database,
        config: coreServices.rootConfig,
        lifecycle: coreServices.lifecycle,
        notificationService: notificationService,
      },
      async init({
        logger,
        scheduler,
        db,
        config,
        lifecycle,
        discovery,
        auth,
        notificationService: notification,
      }) {
        const database = await db.getClient();

        const databaseManager = DatabaseManager.fromConfig(config);
        const notificationsDbService = databaseManager.forPlugin(
          'notifications',
          {
            logger,
            lifecycle,
          },
        );

        const notificationsDb = await notificationsDbService.getClient();

        await scheduler.scheduleTask({
          id: 'catalog-error-monitor',
          frequency: { minutes: 30 },
          timeout: { minutes: 3 },
          fn: async () => {
            let query: MissingRelationTarget[];
            try {
              query = await database
                .with('missing', qb => {
                  qb.select(
                    'sources.entity_id AS id',
                    'sources.entity_ref AS ref',
                    'r.target_entity_ref AS target_ref',
                  )
                    .from('relations as r')
                    .leftJoin(
                      'refresh_state as targets',
                      'r.target_entity_ref',
                      'targets.entity_ref',
                    )
                    .join(
                      'refresh_state as sources',
                      'r.originating_entity_id',
                      'sources.entity_id',
                    )
                    .whereNotIn('r.type', [
                      'memberOf',
                      'hasMember',
                      'parentOf',
                      'childOf',
                    ])
                    .whereNull('targets.entity_ref');
                })
                .select('m.ref', 'm.target_ref', 'o.entity_ref as owner_ref')
                .from('missing as m')
                .join('relations as r', 'm.id', 'r.originating_entity_id')
                .leftJoin(
                  'refresh_state as o',
                  'r.target_entity_ref',
                  'o.entity_ref',
                )
                .where('r.type', 'ownedBy');
            } catch (e) {
              if (e instanceof Error) {
                logger.error(e.message);
              } else {
                logger.error(String(e));
              }
              return;
            }

            const { token } = await auth.getPluginRequestToken({
              onBehalfOf: await auth.getOwnServiceCredentials(),
              targetPluginId: 'catalog',
            });

            const catalogClient = new CatalogClient({
              discoveryApi: discovery,
            });

            const entities = await catalogClient.getEntitiesByRefs(
              {
                entityRefs: query.map(({ ref }) => ref),
                fields: ['kind', 'metadata.name', 'metadata.namespace'],
              },
              { token },
            );

            const currentScopes = new Set<string>();

            // Group broken entities by owner to send one summary notification per
            // owner instead of one notification per entity (prevents HTTP flood).
            type EnrichedItem = {
              entity: NonNullable<(typeof entities.items)[number]>;
              missingRelation: MissingRelationTarget;
            };
            const byOwner = new Map<string, EnrichedItem[]>();

            for (let i = 0; i < entities.items.length; i++) {
              const entity = entities.items[i];
              const missingRelation = query[i];
              if (!entity) {
                logger.error(`Entity not found for ref: ${query[i]?.ref}`);
                continue;
              }
              if (!missingRelation) {
                logger.error(`No missing relation found at index ${i}`);
                continue;
              }

              const ownerRef =
                missingRelation.owner_ref ?? 'group:default/skvis';
              const group = byOwner.get(ownerRef) ?? [];
              group.push({ entity, missingRelation });
              byOwner.set(ownerRef, group);
            }

            for (const [ownerRef, items] of byOwner) {
              const notificationScope = `relation-errors:${ownerRef}`;
              currentScopes.add(notificationScope);

              const exampleLines = items
                .slice(0, 5)
                .map(
                  ({ entity, missingRelation }) =>
                    `• ${entity.metadata.name} → ${missingRelation.target_ref}`,
                )
                .join('\n');
              const moreCount = items.length - 5;
              const moreSuffix = moreCount > 0 ? `\n…and ${moreCount} more` : '';
              const description = `${items.length} entity relation(s) point to non-existent catalog entries.\n\n${exampleLines}${moreSuffix}`;

              await notification.send({
                recipients: {
                  type: 'entity',
                  entityRef: ownerRef,
                },
                payload: {
                  title: `${items.length} relation error(s) detected`,
                  description,
                  severity: 'high',
                  scope: notificationScope,
                },
              });
            }

            // Clean up notifications for fixed relations
            try {
              const existingScopes: string[] = await notificationsDb(
                'notification',
              )
                .distinct('scope')
                .whereNotNull('scope')
                .pluck('scope');

              const scopesToRemove = existingScopes.filter(
                (scope: string) => !currentScopes.has(scope),
              );

              if (scopesToRemove.length > 0) {
                logger.info(
                  `Removing ${scopesToRemove.length} notifications for fixed relation errors: ${scopesToRemove.join(', ')}`,
                );
                const deletedCount = await notificationsDb('notification')
                  .whereIn('scope', scopesToRemove)
                  .delete();

                logger.info(
                  `Successfully deleted ${deletedCount} notifications for fixed relations`,
                );
              } else {
                logger.info(
                  'No fixed relations found, no notifications to remove',
                );
              }
            } catch (e) {
              if (e instanceof Error) {
                logger.error(
                  `Error cleaning up fixed relation notifications: ${e.message}`,
                );
              } else {
                logger.error(
                  `Error cleaning up fixed relation notifications: ${String(e)}`,
                );
              }
            }
          },
        });
      },
    });
  },
});

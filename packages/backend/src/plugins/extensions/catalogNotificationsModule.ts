import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { notificationService } from '@backstage/plugin-notifications-node';
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

            logger.info(
              `catalog-error-monitor: found ${query.length} entities with broken relations`,
            );

            if (query.length === 0) {
              return;
            }

            const currentScopes = new Set<string>();

            // Group broken entities by owner using only data from the SQL query —
            // no HTTP calls needed since the entity ref already encodes kind/namespace/name.
            const byOwner = new Map<string, MissingRelationTarget[]>();

            for (const row of query) {
              const ownerRef = row.owner_ref ?? 'group:default/skvis';
              const group = byOwner.get(ownerRef) ?? [];
              group.push(row);
              byOwner.set(ownerRef, group);
            }

            logger.info(
              `catalog-error-monitor: ${byOwner.size} owner(s) affected`,
            );

            for (const [ownerRef, items] of byOwner) {
              const notificationScope = `relation-errors:${ownerRef}`;
              currentScopes.add(notificationScope);

              const exampleLines = items
                .slice(0, 5)
                .map(({ ref, target_ref }) => `• ${ref} → ${target_ref}`)
                .join('\n');
              const moreCount = items.length - 5;
              const moreSuffix =
                moreCount > 0 ? `\n…and ${moreCount} more` : '';
              const description = `${items.length} entity relation(s) owned by ${ownerRef} point to non-existent catalog entries.\n\n${exampleLines}${moreSuffix}`;

              // Always use broadcast: sending to a group entity triggers recursive
              // member resolution in DefaultNotificationRecipientResolver (Promise.all
              // over the full group hierarchy), which fans out into many concurrent
              // catalog HTTP calls and can OOM the backend for large and deeply nested group
              await notification.send({
                recipients: { type: 'broadcast' },
                payload: {
                  title: `[${ownerRef}] ${items.length} relation error(s) detected`,
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

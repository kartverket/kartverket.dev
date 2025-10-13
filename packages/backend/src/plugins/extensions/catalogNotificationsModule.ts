import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { notificationService } from '@backstage/plugin-notifications-node';
import { CatalogClient } from '@backstage/catalog-client';

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
        notificationService: notificationService,
      },
      async init({
        logger,
        scheduler,
        db,
        discovery,
        auth,
        notificationService: notification,
      }) {
        const database = await db.getClient();

        await scheduler.scheduleTask({
          id: 'catalog-error-monitor',
          frequency: { seconds: 3 },
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
              logger.error(e.toString());
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

            for (let i = 0; i < entities.items.length; i++) {
              const entity = entities.items[i];
              const missingRelation = query[i];
              if (!entity) throw Error('Missing relation source entity');
              if (!entity) throw Error('Missing missing relation relation');

              const namespace = entity.metadata.namespace ?? 'default';
              const entityLink = `/catalog/${namespace}/${entity.kind}/${entity.metadata.name}`;
              const notificationScope = `${entity.metadata.name}${missingRelation.target_ref}`;
              const ownerRef =
                missingRelation.owner_ref ?? 'group:default/skvis';

              notification.send({
                recipients: {
                  type: 'entity',
                  entityRef: ownerRef,
                },
                payload: {
                  title: `Relation error: ${entity.metadata.name}`,
                  description: `This entity has relations to other entities, which can't be found in the catalog.
                                    Entity not found: ${missingRelation.target_ref}`,
                  severity: 'high',
                  link: entityLink,
                  scope: notificationScope,
                },
              });
            }
          },
        });
      },
    });
  },
});

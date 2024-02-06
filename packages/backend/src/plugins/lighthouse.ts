import { createScheduler } from '@backstage/plugin-lighthouse-backend';
import { PluginEnvironment } from '../types';
import { CatalogClient } from '@backstage/catalog-client';

export default async function createPlugin(env: PluginEnvironment) {
  const { logger, scheduler, config, tokenManager } = env;

  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  await createScheduler({
    logger,
    scheduler,
    config,
    catalogClient,
    tokenManager,
  });
}

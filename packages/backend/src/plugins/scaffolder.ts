import { CatalogClient } from '@backstage/catalog-client';
import {createBuiltinActions, createRouter} from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import {createMergeAction} from "@roadiehq/scaffolder-backend-module-utils";
import { ScmIntegrations } from '@backstage/integration';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {

  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });
  const integrations = ScmIntegrations.fromConfig(env.config);

  const roadiehqActions = [
    createMergeAction(),
  ]
  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  })

  const actions = [...builtInActions, ...roadiehqActions];


  return await createRouter({
    actions,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    identity: env.identity,
    permissions: env.permissions,
  });
}

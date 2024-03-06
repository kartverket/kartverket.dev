import { S3Builder } from '@spreadshirt/backstage-plugin-s3-viewer-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const { router } = await S3Builder.createBuilder({
    config: env.config,
    logger: env.logger,
    scheduler: env.scheduler,
    discovery: env.discovery,
    identity: env.identity,
    permissions: env.permissions,
    tokenManager: env.tokenManager,
  }).build();
  return router;
}

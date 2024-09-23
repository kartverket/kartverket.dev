import { createRouter } from '@kartverket/backstage-plugin-dask-onboarding-backend';
import { Router } from 'express';

export default async function createPlugin(
  env: any
): Promise<Router> {
  // Here is where you will add all of the required initialization code that
  // your backend plugin needs to be able to start!

  // The env contains a lot of goodies, but our router currently only
  // needs a logger
  return await createRouter({
    logger: env.logger,
  });
}
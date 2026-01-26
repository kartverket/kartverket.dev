import express from 'express';
import Router from 'express-promise-router';
import { EntraIdConfiguration } from './types';
import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { EntraIdService, ProxyService } from './services/entraIdService';

export interface RouterOptions {
  auth: AuthService;
  logger: LoggerService;
  config: Config;
}

export async function createRouter({
  options,
}: {
  options: RouterOptions;
}): Promise<express.Router> {
  const { auth, logger, config } = options;
  // const backendBaseUrl = config.getString('backend.backendBaseUrl');
  const clientId = config.getString('msal.clientId');
  const clientSecret = config.getString('msal.clientSecret');
  const tenantId = config.getString('msal.tenantId');
  const scope = `${config.getString('msal.clientIdApiA')}/.default`;

  const entraIdConfiguration: EntraIdConfiguration = {
    tenantId: tenantId,
    clientId: clientId,
    clientSecret: clientSecret,
    scope: scope,
  };
  const entraIdService = new EntraIdService(entraIdConfiguration);
  const proxyService = new ProxyService(
    'http://localhost:8080/api/',
    entraIdService,
  );

  const router = Router();
  router.use(express.json());

  router.get('/proxy/fetch-regelrett-form/:id', async (req, res) => {
    try {
      const backstageToken = req.header('Authorization');
      const { id } = req.params;
      if (!backstageToken) throw Error('No backstage token');
      const response = await proxyService.getData(
        logger,
        backstageToken,
        `contexts/${id}`,
      );

      if (response) {
        logger.info(response);
      }
    } catch {
      logger.error('Could not fetch form');
    }
  });

  return router;
}

import express from 'express';
import { ContextResponse, EntraIdConfiguration } from './types';
import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { EntraIdService, ProxyService } from './services/entraIdService';

export interface RouterOptions {
  auth: AuthService;
  logger: LoggerService;
  config: Config;
}

const formatToken = (token: string | undefined): string | null => {
  if (!token || !token.startsWith('Bearer')) {
    return null;
  }
  return token.substring(7).trim();
};

const validateToken = (
  token: string | undefined,
  auth: AuthService,
): string | null => {
  const formattedToken = formatToken(token);
  if (!formattedToken) {
    return null;
  }
  const credentials = auth.authenticate(formattedToken);
  if (!credentials) {
    return null;
  }
  return formattedToken;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { auth, logger, config } = options;
  const externalAPI = 'regelrett';
  const backendBaseUrl = config.getString(`${externalAPI}.baseUrl`);
  const clientId = config.getString(
    'auth.providers.microsoft.development.clientId',
  );
  const clientSecret = config.getString(
    'auth.providers.microsoft.development.clientSecret',
  );
  const tenantId = config.getString(
    'auth.providers.microsoft.development.tenantId',
  );
  const scope = `${config.getString(`${externalAPI}.clientId`)}/.default`;

  const entraIdConfiguration: EntraIdConfiguration = {
    tenantId: tenantId,
    clientId: clientId,
    clientSecret: clientSecret,
    scope: scope,
  };

  logger.info('[Router] Creating router with config:', {
    hasAuth: !!auth,
    hasLogger: !!logger,
    hasConfig: !!config,
  });

  const entraIdService = new EntraIdService(entraIdConfiguration, logger);
  const proxyService = new ProxyService(
    'http://localhost:8080/api',
    entraIdService,
  );

  const router = express.Router();
  router.use(express.json());

  router.get('/proxy/fetch-regelrett-form', async (req, res) => {
    try {
      const validToken = validateToken(req.header('Authorization'), auth);
      if (!validToken) {
        res.status(401).send({
          frontendMessage: 'Token is not valid',
        });
      }
      const eidToken = req.header('Entraid');
      const contextId = req.query.contextId;
      if (!eidToken) throw Error('No token');
      const response: ContextResponse = await proxyService.getData(
        logger,
        eidToken,
        `contexts/${contextId}`,
      );
      // Better status code handling
      if (response) {
        res.status(200).send(response);
      } else {
        res.status(500).send({ frontendMessage: 'An error occured' });
      }
    } catch (error) {
      logger.error('Could not fetch form', error as Error);
    }
  });

  return router;
}

import express from 'express';
import { ApiError, Context, EntraIdConfiguration, Result } from './types';
import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { EntraIdService } from './services/entraIdService';
import { ProxyApiService } from './services/proxyApiService';

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
  const environment = config.getString('auth.environment');
  const clientId = config.getString(
    `auth.providers.microsoft.${environment}.clientId`,
  );
  const clientSecret = config.getString(
    `auth.providers.microsoft.${environment}.clientSecret`,
  );
  const tenantId = config.getString(
    `auth.providers.microsoft.${environment}.tenantId`,
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
  const proxyService = new ProxyApiService(
    backendBaseUrl,
    entraIdService,
    logger,
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
      const name = req.query.name;
      if (typeof name !== 'string')
        throw new Error('No name parameter provided');
      if (!eidToken) throw new Error('No token');
      const response: Result<ApiError, Context> =
        await proxyService.fetchContextByFunctionName(eidToken, name);
      if (response.ok) {
        res.status(200).send(response.data);
      } else {
        res
          .status(response.error.statusCode)
          .send({ frontendMessage: response.error.message });
        logger.error(
          `Recieved a ${response.error.statusCode} status code when trying to fetch context by name from Regelrett API.`,
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to fetch context by name: ${error.message}`);
        res.status(500).send({
          message: `Failed to fetch context by name: ${error.message}`,
        });
      } else {
        logger.error(`Failed to fetch context by name: ${error}`);
        res
          .status(500)
          .send({ message: `Failed to fetch context by name: ${error}` });
      }
    }
  });

  router.get('/proxy/fetch-regelrett-forms-by-team-id', async (req, res) => {
    try {
      const validToken = validateToken(req.header('Authorization'), auth);
      if (!validToken) {
        res.status(401).send({
          frontendMessage: 'Token is not valid',
        });
      }
      const eidToken = req.header('Entraid');
      const teamId = req.query.teamId;
      if (typeof teamId !== 'string')
        throw new Error('No name parameter provided');
      if (!eidToken) throw new Error('No token');
      const response: Result<ApiError, Context> =
        await proxyService.fetchContextByTeamId(eidToken, teamId);
      if (response.ok) {
        res.status(200).send(response.data);
      } else {
        res
          .status(response.error.statusCode)
          .send({ frontendMessage: response.error.message });
        logger.error(
          `Recieved a ${response.error.statusCode} status code when trying to fetch context by team id from Regelrett API.`,
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to fetch context by team id: ${error.message}`);
        res.status(500).send({
          message: `Failed to fetch context by team id: ${error.message}`,
        });
      } else {
        logger.error(`Failed to fetch context by team id: ${error}`);
        res
          .status(500)
          .send({ message: `Failed to fetch context by team id: ${error}` });
      }
    }
  });

  return router;
}

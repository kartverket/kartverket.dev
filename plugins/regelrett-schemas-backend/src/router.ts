import express, { Request } from 'express';
import {
  AuthService,
  LoggerService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import {
  ApiError,
  RegelrettRequestIdentity,
  RegelrettService,
  Result,
} from './types';
import { createRegelrettService } from './services/createRegelrettService';

interface RouterOptions {
  auth: AuthService;
  userInfo: UserInfoService;
  logger: LoggerService;
  config: Config;
  service?: RegelrettService;
}

const formatToken = (authorization: string | undefined): string | undefined => {
  if (!authorization?.startsWith('Bearer ')) {
    return undefined;
  }
  return authorization.substring(7).trim();
};

async function getRequestIdentity(
  req: Request,
  auth: AuthService,
  userInfo: UserInfoService,
): Promise<RegelrettRequestIdentity | undefined> {
  const token = formatToken(req.header('Authorization'));
  if (!token) {
    return undefined;
  }

  try {
    const credentials = await auth.authenticate(token);
    if (!auth.isPrincipal(credentials, 'user')) {
      return undefined;
    }
    const identity = await userInfo.getUserInfo(credentials);
    return {
      ...identity,
      entraIdToken: req.header('Entraid'),
    };
  } catch {
    return undefined;
  }
}

function sendResult<Data>(
  res: express.Response,
  result: Result<ApiError, Data>,
) {
  if (result.ok) {
    res.status(200).send(result.data);
    return;
  }
  res.status(result.error.statusCode).send({
    message: result.error.message,
    frontendMessage: result.error.message,
  });
}

function queryString(value: unknown, name: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`No ${name} parameter provided`);
  }
  return value;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { auth, userInfo, logger, config } = options;
  const service = options.service ?? createRegelrettService(config, logger);
  const router = express.Router();
  router.use(express.json());

  const withIdentity =
    (
      handler: (
        req: Request,
        res: express.Response,
        identity: RegelrettRequestIdentity,
      ) => Promise<void>,
    ) =>
    async (req: Request, res: express.Response) => {
      const identity = await getRequestIdentity(req, auth, userInfo);
      if (!identity) {
        res.status(401).send({
          message: 'Token is not valid',
          frontendMessage: 'Token is not valid',
        });
        return;
      }

      try {
        await handler(req, res, identity);
      } catch (caught) {
        const message =
          caught instanceof Error ? caught.message : String(caught);
        logger.error(`Regelrett adapter request failed: ${message}`);
        res.status(500).send({
          message: `Regelrett adapter request failed: ${message}`,
        });
      }
    };

  router.get(
    '/proxy/fetch-regelrett-form',
    withIdentity(async (req, res, identity) => {
      const name = queryString(req.query.name, 'name');
      sendResult(res, await service.fetchContextByFunctionName(identity, name));
    }),
  );

  router.post(
    '/proxy/create-regelrett-form',
    withIdentity(async (req, res, identity) => {
      const name = queryString(req.query.name, 'name');
      const formId = queryString(req.query.formId, 'formId');
      const teamId = queryString(req.query.teamId, 'teamId');
      sendResult(
        res,
        await service.createRegelrettContext(identity, name, formId, teamId),
      );
    }),
  );

  router.get(
    '/proxy/fetch-regelrett-forms-by-team-id',
    withIdentity(async (req, res, identity) => {
      const teamId = queryString(req.query.teamId, 'teamId');
      sendResult(res, await service.fetchContextByTeamId(identity, teamId));
    }),
  );

  router.get(
    '/proxy/fetch-regelrett-form-types',
    withIdentity(async (_req, res, identity) => {
      sendResult(res, await service.fetchForms(identity));
    }),
  );

  return router;
}

import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { Either } from '../../Either';
import { ErrorResponse } from './typesBackend';
import express from 'express';

export const errorResponse = (
  status: number,
  code: string,
  message: string,
): ErrorResponse => ({
  status,
  code,
  message,
});

const unknownErrorResponse = (message: string): ErrorResponse =>
  errorResponse(500, 'UNKNOWN_ERROR', message);

const validateToken = async (
  token: string | undefined,
  auth: AuthService,
): Promise<string | null> => {
  if (!token?.startsWith('Bearer ')) {
    return null;
  }
  const formattedToken = token.substring(7).trim();
  if (!formattedToken) {
    return null;
  }
  try {
    await auth.authenticate(formattedToken);
  } catch {
    return null;
  }
  return formattedToken;
};

export const requireBackstageToken = async (
  req: express.Request,
  auth: AuthService,
): Promise<ErrorResponse | null> => {
  const backstageToken = req.header('Authorization');
  const validToken = await validateToken(backstageToken, auth);
  if (!validToken || !backstageToken) {
    return errorResponse(401, 'UNAUTHORIZED', 'Token is not valid');
  }
  return null;
};

export const requireHeader = (
  value: string | undefined,
  name: string,
): string | ErrorResponse =>
  value ? value : errorResponse(400, 'BAD_REQUEST', `${name} is required`);

export const sendEither = <T>(
  res: express.Response,
  result: Either<ErrorResponse, T>,
  successStatus = 200,
) => {
  if (result.isRight()) {
    if (successStatus === 204) {
      return res.sendStatus(204);
    }

    return res.status(successStatus).send(result.value);
  }

  return res.status(result.error.status).send(result.error);
};

export const withErrorHandling =
  (
    logger: LoggerService,
    errorMessage: string,
    handler: (req: express.Request, res: express.Response) => Promise<unknown>,
  ) =>
  async (req: express.Request, res: express.Response) => {
    try {
      return await handler(req, res);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`${errorMessage}: ${error}`);

      return res
        .status(500)
        .send(unknownErrorResponse(`${errorMessage}: ${message}`));
    }
  };

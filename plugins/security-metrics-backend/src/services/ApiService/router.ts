import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { Config } from '@backstage/config';
import { ApiService } from './api.service';
import { EntraIdService } from '../EntraIdService/auth.service';
import {
  ChangeStatusRequestBody,
  ConfigureNotificationsRequestBody,
  FetchMetricsRequestBody,
  FetchTrendsRequestBody,
} from './typesBackend';
import { getBackendConfig } from '../config';
import {
  errorResponse,
  requireBackstageToken,
  requireHeader,
  sendEither,
  withErrorHandling,
} from './routerUtils';

export interface RouterOptions {
  auth: AuthService;
  logger: LoggerService;
  config: Config;
}

export const createRouter = async (
  options: RouterOptions,
): Promise<express.Router> => {
  const { auth, logger, config } = options;
  const backendConfig = getBackendConfig(config);

  logger.info('[Router] Creating router with config:', {
    hasAuth: !!auth,
    hasLogger: !!logger,
    hasConfig: !!config,
    backendBaseUrl: backendConfig.backendBaseUrl,
  });

  const entraIdService = new EntraIdService(
    backendConfig.entraIdConfig,
    logger,
  );
  const apiService = new ApiService(
    backendConfig.backendBaseUrl,
    entraIdService,
    logger,
  );

  const router = Router();
  router.use(express.json());

  router.use((req, _, next) => {
    logger.info(`[Router] Incoming request: ${req.method} ${req.path}`, {
      headers: {
        authorization: req.header('Authorization')
          ? 'Bearer [PRESENT]'
          : 'MISSING',
        contentType: req.header('Content-Type'),
        userAgent: req.header('User-Agent'),
      },
      body: {
        hasRepositoryNames: !!req.body?.repositoryNames,
        repositoryNamesLength: req.body?.repositoryNames?.length,
        repositoryNames: req.body?.repositoryNames,
        hasEntraIdToken: !!req.body?.entraIdToken,
        entraIdTokenLength: req.body?.entraIdToken?.length,
      },
    });
    next();
  });

  router.get(
    '/proxy/metrics-update-status/',
    withErrorHandling(
      logger,
      'Failed to fetch metrics update status',
      async (req, res) => {
        const authError = requireBackstageToken(req, auth);
        if (authError) {
          return res.status(authError.status).send(authError);
        }

        const entraIdToken = req.header('EntraId');
        if (!entraIdToken) {
          return res
            .status(400)
            .send(errorResponse(400, 'BAD_REQUEST', 'EntraId is required'));
        }

        const result = await apiService.fetchMetricsUpdateStatus(entraIdToken);

        return sendEither(res, result);
      },
    ),
  );

  router.post(
    '/proxy/fetch-metrics/',
    withErrorHandling(
      logger,
      'Failed to fetch metrics data',
      async (req, res) => {
        const authError = requireBackstageToken(req, auth);
        if (authError) {
          return res.status(authError.status).send(authError);
        }

        const request = req.body as FetchMetricsRequestBody;
        const result = await apiService.fetchMetricsData(
          request.componentNames,
          request.entraIdToken,
        );

        return sendEither(res, result);
      },
    ),
  );

  router.get(
    '/proxy/fetch-component-metrics/',
    withErrorHandling(
      logger,
      'Failed to fetch metrics data',
      async (req, res) => {
        const authError = requireBackstageToken(req, auth);
        if (authError) {
          return res.status(authError.status).send(authError);
        }

        const componentName = req.query.componentName as string | undefined;
        if (!componentName) {
          return res
            .status(400)
            .send(
              errorResponse(
                400,
                'BAD_REQUEST',
                'Mangler componentName query parameter',
              ),
            );
        }

        const entraIdHeader = requireHeader(req.header('EntraId'), 'EntraId');
        if (typeof entraIdHeader !== 'string') {
          return res.status(entraIdHeader.status).send(entraIdHeader);
        }

        const result = await apiService.fetchComponentMetricsData(
          componentName,
          entraIdHeader,
        );

        return sendEither(res, result);
      },
    ),
  );

  router.post(
    '/proxy/fetch-trends/',
    withErrorHandling(
      logger,
      'Failed to fetch vulnerability trends data',
      async (req, res) => {
        const authError = requireBackstageToken(req, auth);
        if (authError) {
          return res.status(authError.status).send(authError);
        }

        const request = req.body as FetchTrendsRequestBody;
        const result = await apiService.fetchVulnerabilityTrendsData(
          request.componentNames,
          request.fromDate,
          request.toDate,
          request.entraIdToken,
        );

        return sendEither(res, result);
      },
    ),
  );

  router.put(
    '/proxy/change-status-vulnerability/',
    withErrorHandling(
      logger,
      'Failed to change status of vulnerability',
      async (req, res) => {
        const authError = requireBackstageToken(req, auth);
        if (authError) {
          return res.status(authError.status).send(authError);
        }

        const request = req.body as ChangeStatusRequestBody;

        const result = await apiService.changeStatusVulnerability(
          request.componentName,
          request.vulnerabilityId,
          request.status,
          request.comment,
          request.changedBy,
          request.entraIdToken,
        );

        return sendEither(res, result, 204);
      },
    ),
  );

  router.put(
    '/proxy/configure-notifications/',
    withErrorHandling(
      logger,
      'Failed to configure notifications',
      async (req, res) => {
        const authError = requireBackstageToken(req, auth);
        if (authError) {
          return res.status(authError.status).send(authError);
        }

        const request = req.body as ConfigureNotificationsRequestBody;

        const result = await apiService.configureNotifications(
          request.teamName,
          request.componentNames,
          request.channelId,
          request.entraIdToken,
          request.severity,
        );

        return sendEither(res, result, 204);
      },
    ),
  );

  router.get(
    '/proxy/configure-notifications/',
    withErrorHandling(
      logger,
      'Failed to fetch notifications config',
      async (req, res) => {
        const authError = requireBackstageToken(req, auth);
        if (authError) {
          return res.status(authError.status).send(authError);
        }

        const teamName = String(req.query.teamName ?? '');
        if (!teamName) {
          return res
            .status(400)
            .send(errorResponse(400, 'BAD_REQUEST', 'teamName is required'));
        }

        const entraIdHeader = requireHeader(req.header('EntraId'), 'EntraId');
        if (typeof entraIdHeader !== 'string') {
          return res.status(entraIdHeader.status).send(entraIdHeader);
        }

        const result = await apiService.getNotificationsConfig(
          teamName,
          entraIdHeader,
        );

        return sendEither(res, result);
      },
    ),
  );

  return router;
};

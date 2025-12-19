import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';

export interface RouterOptions {
  auth: AuthService;
  // logger: LoggerService;
  // config: Config;
}

export const createRouter = async (
  options: RouterOptions,
): Promise<express.Router> => {
  // TODO build router

  const router = Router();
  router.use(express.json());
  return router;
};

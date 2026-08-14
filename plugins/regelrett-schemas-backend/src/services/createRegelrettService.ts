import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { RegelrettService } from '../types';
import { EntraIdService } from './entraIdService';
import { ProxyApiService } from './proxyApiService';
import { SyntheticRegelrettService } from './syntheticRegelrettService';

export function createRegelrettService(
  config: Config,
  logger: LoggerService,
): RegelrettService {
  const mode = config.getString('regelrett.mode');
  if (mode === 'synthetic') {
    logger.info('Using deterministic synthetic Regelrett adapter');
    return new SyntheticRegelrettService();
  }
  if (mode !== 'connected') {
    throw new Error(
      `The Regelrett backend plugin cannot start in '${mode}' mode`,
    );
  }

  const authentication = config.getString('regelrett.authentication');
  if (authentication !== 'entra') {
    throw new Error(
      `Connected Regelrett authentication '${authentication}' is not implemented yet`,
    );
  }

  const environment = config.getString('auth.environment');
  const entraIdService = new EntraIdService(
    {
      tenantId: config.getString(
        `auth.providers.microsoft.${environment}.tenantId`,
      ),
      clientId: config.getString(
        `auth.providers.microsoft.${environment}.clientId`,
      ),
      clientSecret: config.getString(
        `auth.providers.microsoft.${environment}.clientSecret`,
      ),
      scope: `${config.getString('regelrett.clientId')}/.default`,
    },
    logger,
  );

  return new ProxyApiService(
    config.getString('regelrett.baseUrl'),
    entraIdService,
    logger,
  );
}

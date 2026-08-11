import { Config } from '@backstage/config';

export const integrationIds = [
  'lighthouse',
  'sikkerhetsmetrikker',
  'regelrett',
  'ros',
  'catalogCreator',
  'securityChampion',
  'opencost',
] as const;

export type IntegrationId = (typeof integrationIds)[number];
export type IntegrationMode = 'disabled' | 'synthetic' | 'connected';
export type ConnectionAuthentication = 'synthetic' | 'entra';

const integrationModes = new Set<IntegrationMode>([
  'disabled',
  'synthetic',
  'connected',
]);
const connectionAuthentications = new Set<ConnectionAuthentication>([
  'synthetic',
  'entra',
]);

const connectedRequirements: Partial<Record<IntegrationId, string[]>> = {
  lighthouse: ['lighthouse.baseUrl'],
  sikkerhetsmetrikker: [
    'sikkerhetsmetrikker.baseUrl',
    'sikkerhetsmetrikker.clientId',
    'sikkerhetsmetrikker.authentication',
  ],
  regelrett: [
    'regelrett.baseUrl',
    'regelrett.url',
    'regelrett.clientId',
    'regelrett.authentication',
  ],
};

const productionEndpointPatterns = [
  /\.regelrett-main(?::|\/|$)/i,
  /\.sikkerhetsmetrikker-main(?::|\/|$)/i,
  /\.ros-plugin-main(?::|\/|$)/i,
  /monitoring\.kartverket\.cloud/i,
  /opencost\.dev\.skip\.statkart\.no/i,
];

const endpointConfigPaths = [
  'regelrett.baseUrl',
  'regelrett.url',
  'sikkerhetsmetrikker.baseUrl',
  'grafana.domain',
];

const proxyEndpointIds = [
  '/risc-proxy',
  '/security-champion-proxy',
  '/opencost',
] as const;

const syntheticProviderIds = [
  'synthetic-atlas',
  'synthetic-compass',
  'synthetic-multiteam',
  'synthetic-product-area',
  'synthetic-business-unit',
  'synthetic-unaffiliated',
  'synthetic-admin',
];

export function getIntegrationMode(
  config: Config,
  integrationId: IntegrationId,
): IntegrationMode {
  const path = `${integrationId}.mode`;
  const mode = config.getOptionalString(path);
  if (!mode) {
    throw new Error(`Missing required configuration '${path}'`);
  }
  if (!integrationModes.has(mode as IntegrationMode)) {
    throw new Error(
      `Invalid value '${mode}' for '${path}'; expected disabled, synthetic, or connected`,
    );
  }
  return mode as IntegrationMode;
}

export function validateAppConfig(config: Config): void {
  const errors: string[] = [];
  const environment = config.getOptionalString('auth.environment');

  if (environment !== 'development' && environment !== 'production') {
    errors.push(
      "'auth.environment' must explicitly be 'development' or 'production'",
    );
  }

  const modes = new Map<IntegrationId, IntegrationMode>();
  for (const integrationId of integrationIds) {
    try {
      modes.set(integrationId, getIntegrationMode(config, integrationId));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  for (const [integrationId, mode] of modes) {
    if (environment === 'production' && mode === 'synthetic') {
      errors.push(`'${integrationId}.mode' cannot be synthetic in production`);
    }

    if (mode === 'connected') {
      for (const path of connectedRequirements[integrationId] ?? []) {
        if (!config.getOptionalString(path)) {
          errors.push(
            `'${path}' is required when '${integrationId}.mode' is connected`,
          );
        }
      }
    }
  }

  validateConnectionAuthentication(config, modes, environment, errors);
  validateAuthProviders(config, environment, errors);

  if (environment === 'production') {
    validateProductionDoesNotContainSyntheticSources(config, errors);
  }
  if (environment === 'development') {
    validateDevelopmentDoesNotUseProductionEndpoints(config, errors);
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid Kartverket.dev configuration:\n${errors
        .map(error => `- ${error}`)
        .join('\n')}`,
    );
  }
}

function validateConnectionAuthentication(
  config: Config,
  modes: Map<IntegrationId, IntegrationMode>,
  environment: string | undefined,
  errors: string[],
) {
  for (const integrationId of ['regelrett', 'sikkerhetsmetrikker'] as const) {
    if (modes.get(integrationId) !== 'connected') {
      continue;
    }

    const path = `${integrationId}.authentication`;
    const authentication = config.getOptionalString(path);
    if (
      authentication &&
      !connectionAuthentications.has(authentication as ConnectionAuthentication)
    ) {
      errors.push(
        `Invalid value '${authentication}' for '${path}'; expected synthetic or entra`,
      );
      continue;
    }

    if (authentication === 'synthetic' && environment === 'production') {
      errors.push(`'${path}' cannot be synthetic in production`);
    }

    if (
      authentication === 'entra' &&
      environment &&
      !config.has(`auth.providers.microsoft.${environment}`)
    ) {
      errors.push(
        `'auth.providers.microsoft.${environment}' is required when '${path}' is entra`,
      );
    }
  }
}

function validateAuthProviders(
  config: Config,
  environment: string | undefined,
  errors: string[],
) {
  if (!environment) {
    return;
  }

  if (
    config.has(`auth.providers.microsoft.${environment}`) &&
    !config.has('catalog.providers.microsoftGraphOrg')
  ) {
    errors.push(
      `'catalog.providers.microsoftGraphOrg' is required when Microsoft login is enabled for '${environment}'`,
    );
  }

  if (environment === 'production') {
    const providerIds =
      config.getOptionalConfig('auth.providers')?.keys() ?? [];
    for (const providerId of providerIds) {
      if (providerId.startsWith('synthetic-')) {
        errors.push(
          `Synthetic auth provider '${providerId}' cannot be configured in production`,
        );
      }
    }

    if (!config.has('auth.providers.microsoft.production')) {
      errors.push(
        "'auth.providers.microsoft.production' is required for production authentication",
      );
    }
    if (!config.has('catalog.providers.microsoftGraphOrg')) {
      errors.push(
        "'catalog.providers.microsoftGraphOrg' is required for the production organization catalog",
      );
    }
    if (!config.getOptionalString('backend.database.client')) {
      errors.push("'backend.database.client' is required in production");
    }
  }

  if (environment === 'development') {
    for (const providerId of syntheticProviderIds) {
      if (!config.has(`auth.providers.${providerId}`)) {
        errors.push(
          `Synthetic auth provider '${providerId}' is required in the development profile`,
        );
      }
    }
  }
}

function validateProductionDoesNotContainSyntheticSources(
  config: Config,
  errors: string[],
) {
  for (const location of config.getOptionalConfigArray('catalog.locations') ??
    []) {
    const target = location.getOptionalString('target');
    if (target?.includes('examples/local')) {
      errors.push(
        `Synthetic catalog location '${target}' cannot be configured in production`,
      );
    }
  }

  if (config.has('synthetic')) {
    errors.push(
      "Top-level 'synthetic' configuration cannot be used in production",
    );
  }
}

function validateDevelopmentDoesNotUseProductionEndpoints(
  config: Config,
  errors: string[],
) {
  for (const path of endpointConfigPaths) {
    const value = config.getOptionalString(path);
    if (
      value &&
      productionEndpointPatterns.some(pattern => pattern.test(value))
    ) {
      errors.push(
        `Known production endpoint '${value}' cannot be used by local development configuration '${path}'`,
      );
    }
  }

  const proxyEndpoints =
    config.getOptional<Record<string, { target?: unknown }>>('proxy.endpoints');
  for (const endpointId of proxyEndpointIds) {
    const target = proxyEndpoints?.[endpointId]?.target;
    if (
      typeof target === 'string' &&
      productionEndpointPatterns.some(pattern => pattern.test(target))
    ) {
      errors.push(
        `Known production endpoint '${target}' cannot be used by local development configuration 'proxy.endpoints.${endpointId}.target'`,
      );
    }
  }
}

import { ConfigReader } from '@backstage/config';
import { validateAppConfig } from './integrations';

const integrationModes = {
  lighthouse: { mode: 'disabled' },
  sikkerhetsmetrikker: { mode: 'disabled' },
  regelrett: { mode: 'disabled' },
  ros: { mode: 'disabled' },
  catalogCreator: { mode: 'disabled' },
  securityChampion: { mode: 'disabled' },
  opencost: { mode: 'disabled' },
};

const syntheticProviders = {
  'synthetic-atlas': {},
  'synthetic-compass': {},
  'synthetic-multiteam': {},
  'synthetic-product-area': {},
  'synthetic-business-unit': {},
  'synthetic-unaffiliated': {},
  'synthetic-admin': {},
};

describe('validateAppConfig', () => {
  it('accepts an explicit disconnected development profile', () => {
    const config = new ConfigReader({
      auth: {
        environment: 'development',
        providers: syntheticProviders,
      },
      ...integrationModes,
    });

    expect(() => validateAppConfig(config)).not.toThrow();
  });

  it('rejects synthetic sources in production', () => {
    const config = new ConfigReader({
      auth: {
        environment: 'production',
        providers: {
          microsoft: { production: {} },
          'synthetic-atlas': {},
        },
      },
      backend: { database: { client: 'pg' } },
      catalog: {
        providers: { microsoftGraphOrg: {} },
        locations: [
          { type: 'file', target: '../../examples/local/catalog.yaml' },
        ],
      },
      ...integrationModes,
      ros: { mode: 'synthetic' },
    });

    expect(() => validateAppConfig(config)).toThrow(
      /Synthetic auth provider 'synthetic-atlas'.*Synthetic catalog location/s,
    );
  });

  it('lists missing connected configuration', () => {
    const config = new ConfigReader({
      auth: {
        environment: 'development',
        providers: syntheticProviders,
      },
      ...integrationModes,
      regelrett: { mode: 'connected', authentication: 'entra' },
    });

    expect(() => validateAppConfig(config)).toThrow(
      /regelrett\.baseUrl.*regelrett\.url.*regelrett\.clientId.*auth\.providers\.microsoft\.development/s,
    );
  });

  it('requires Microsoft Graph catalog data for Microsoft login', () => {
    const config = new ConfigReader({
      auth: {
        environment: 'development',
        providers: {
          ...syntheticProviders,
          microsoft: { development: {} },
        },
      },
      ...integrationModes,
    });

    expect(() => validateAppConfig(config)).toThrow(
      /catalog\.providers\.microsoftGraphOrg.*Microsoft login/s,
    );
  });

  it('rejects known production endpoints in development', () => {
    const config = new ConfigReader({
      auth: {
        environment: 'development',
        providers: syntheticProviders,
      },
      ...integrationModes,
      regelrett: {
        mode: 'disabled',
        baseUrl: 'http://regelrett-backend.regelrett-main:8080',
      },
    });

    expect(() => validateAppConfig(config)).toThrow(
      /Known production endpoint.*regelrett-main/s,
    );
  });
});

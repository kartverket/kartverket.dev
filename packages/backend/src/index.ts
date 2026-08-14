import { createBackend } from '@backstage/backend-defaults';
import {
  coreServices,
  createBackendFeatureLoader,
} from '@backstage/backend-plugin-api';
import { getIntegrationMode, validateAppConfig } from './config/integrations';
import { authModuleMicrosoftProvider } from './plugins/extensions/auth';
import { msGroupTransformerCatalogModule } from './plugins/extensions/catalog';
import { catalogNotificationsModule } from './plugins/extensions/catalogNotificationsModule';
import { authModuleSyntheticPersonas } from './plugins/extensions/syntheticAuth';

const backend = createBackend();

const optionalIntegrations = createBackendFeatureLoader({
  deps: { config: coreServices.rootConfig },
  async *loader({ config }) {
    validateAppConfig(config);
    const authEnvironment = config.getString('auth.environment');

    if (authEnvironment === 'development') {
      yield authModuleSyntheticPersonas;
    }
    if (config.has(`auth.providers.microsoft.${authEnvironment}`)) {
      yield authModuleMicrosoftProvider;
    }
    if (config.has(`auth.providers.google.${authEnvironment}`)) {
      yield import('@backstage/plugin-auth-backend-module-google-provider');
    }
    if (config.has(`auth.providers.github.${authEnvironment}`)) {
      yield import('@backstage/plugin-auth-backend-module-github-provider');
    }

    if (config.has('catalog.providers.github')) {
      yield import('@backstage/plugin-catalog-backend-module-github');
    }
    if (config.has('catalog.providers.microsoftGraphOrg')) {
      yield import('@backstage/plugin-catalog-backend-module-msgraph');
      yield msGroupTransformerCatalogModule;
    }

    if (getIntegrationMode(config, 'lighthouse') === 'connected') {
      yield import('@backstage-community/plugin-lighthouse-backend');
    }
    if (config.has('integrations.github')) {
      yield import('@backstage/plugin-scaffolder-backend-module-github');
    }
    if (config.getString('backend.database.client') === 'pg') {
      yield import('@backstage/plugin-search-backend-module-pg');
    }
    if (getIntegrationMode(config, 'sikkerhetsmetrikker') === 'connected') {
      yield import('@kartverket/backstage-plugin-security-metrics-backend');
    }
    if (getIntegrationMode(config, 'regelrett') !== 'disabled') {
      yield import('@internal/backstage-plugin-regelrett-schemas-backend');
    }
    if (getIntegrationMode(config, 'ros') === 'connected') {
      yield import('@kartverket/backstage-plugin-risk-scorecard-backend');
    }
  },
});

backend.add(optionalIntegrations);

// App
backend.add(import('@backstage/plugin-app-backend'));

// Auth
backend.add(import('@backstage/plugin-auth-backend'));

// Catalog
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));
backend.add(import('@backstage/plugin-catalog-backend-module-openapi'));

// Explore
backend.add(import('@backstage-community/plugin-explore-backend'));

// Devtools
backend.add(import('@backstage/plugin-devtools-backend'));

// Proxy
backend.add(import('@backstage/plugin-proxy-backend'));

// Scaffolder
backend.add(import('@backstage/plugin-scaffolder-backend'));

// Search
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// TechDocs
backend.add(import('@backstage/plugin-techdocs-backend'));

// Notifications
backend.add(import('@backstage/plugin-notifications-backend'));
backend.add(catalogNotificationsModule);
backend.add(import('@backstage/plugin-signals-backend'));
backend.add(import('@internal/plugin-catalog-backend-module-function-kind'));

backend.start();

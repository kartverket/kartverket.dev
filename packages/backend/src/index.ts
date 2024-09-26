import {createBackend} from '@backstage/backend-defaults';
import {legacyPlugin} from '@backstage/backend-common';
import {authModuleGithubLocalProvider, authModuleMicrosoftProvider} from "./plugins/extensions/auth";
import {msGroupTransformerCatalogModule, securityChampionsCatalogModule} from "./plugins/extensions/catalog";


const backend = createBackend();

// App
backend.add(import('@backstage/plugin-app-backend/alpha'));

// Auth
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(authModuleGithubLocalProvider);
backend.add(authModuleMicrosoftProvider);
backend.add(import('@backstage/plugin-auth-backend-module-google-provider')); // Required for ROS Plugin
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));

// Catalog
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-github/alpha'));
backend.add(securityChampionsCatalogModule);
backend.add(import('@backstage/plugin-catalog-backend-module-msgraph/alpha'));
backend.add(msGroupTransformerCatalogModule);
backend.add(import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'));
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// Explore
backend.add(import('@backstage-community/plugin-explore-backend'));

// DASK
backend.add(legacyPlugin('dask-onboarding', import('./plugins/dask-onboarding')));

// Devtools
backend.add(import('@backstage/plugin-devtools-backend'));

// Kubernetes
backend.add(import('@backstage/plugin-kubernetes-backend/alpha'));

// Lighthouse
backend.add(import('@backstage-community/plugin-lighthouse-backend'));

// Lighthouse
backend.add(import('@backstage-community/plugin-linguist-backend'));

// Proxy
backend.add(import('@backstage/plugin-proxy-backend/alpha'));

// Scaffolder
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));

// Search
backend.add(import('@backstage/plugin-search-backend/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-catalog/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs/alpha'));

// TechDocs
backend.add(import('@backstage/plugin-techdocs-backend/alpha'));

// Security metrics
backend.add(import('@kartverket/backstage-plugin-security-metrics-backend'));


backend.start();

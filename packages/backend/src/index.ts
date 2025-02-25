import { createBackend } from '@backstage/backend-defaults';
import { legacyPlugin } from '@backstage/backend-common';
import {
    authModuleMicrosoftProvider
} from "./plugins/extensions/auth";
import {msGroupTransformerCatalogModule} from "./plugins/extensions/catalog";


const backend = createBackend();

// App
backend.add(import('@backstage/plugin-app-backend'));

// Auth
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(authModuleMicrosoftProvider);
backend.add(import('@backstage/plugin-auth-backend-module-google-provider')); // Required for ROS Plugin
backend.add(import('@backstage/plugin-auth-backend-module-github-provider')); // Required for ROS Plugin
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));

// Catalog
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@backstage/plugin-catalog-backend-module-github'));
backend.add(import('@backstage/plugin-catalog-backend-module-msgraph'));
backend.add(msGroupTransformerCatalogModule);
backend.add(import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'));
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// Explore
backend.add(import('@backstage-community/plugin-explore-backend'));

// Devtools
backend.add(import('@backstage/plugin-devtools-backend'));

// Lighthouse
backend.add(import('@backstage-community/plugin-lighthouse-backend'));

// Linguist
backend.add(import('@backstage-community/plugin-linguist-backend'));

// Proxy
backend.add(import('@backstage/plugin-proxy-backend'));

// Scaffolder
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));

// Search
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));
backend.add(import('@backstage/plugin-search-backend-module-pg'));

// TechDocs
backend.add(import('@backstage/plugin-techdocs-backend'));
backend.add(import('@internal/plugin-dask-onboarding-backend'));

backend.start();

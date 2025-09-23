import { ExplorePage } from '@backstage-community/plugin-explore';
import { LighthousePage } from '@backstage-community/plugin-lighthouse';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import {
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
} from '@backstage/core-components';
import {
  configApiRef,
  microsoftAuthApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { DevToolsPage } from '@backstage/plugin-devtools';
import { HomepageCompositionRoot, VisitListener } from '@backstage/plugin-home';
import { orgPlugin } from '@backstage/plugin-org';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { SearchPage } from '@backstage/plugin-search';
import {
  DefaultTechDocsHome,
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { DaskOnboardingPage } from '@kartverket/backstage-plugin-dask-onboarding';
import { OpencostPage } from '@kartverket/backstage-plugin-opencost';
import { pluginRiScNorwegianTranslation } from '@kartverket/backstage-plugin-risk-scorecard';
import { PostHogProvider } from 'posthog-js/react';
import { Route } from 'react-router-dom';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { HomePage } from './components/home/HomePage';
import { Root } from './components/Root';
import { searchPage } from './components/search/SearchPage';

const app = createApp({
  __experimentalTranslations: {
    availableLanguages: ['en', 'no'],
    resources: [pluginRiScNorwegianTranslation],
  },
  components: {
    SignInPage: props => {
      const configApi = useApi(configApiRef);
      if (configApi.getOptionalString('auth.environment') !== 'production') {
        return (
          <SignInPage
            {...props}
            auto
            providers={[
              {
                id: 'microsoft-auth-provider',
                title: 'Microsoft',
                message: 'Sign in using Microsoft',
                apiRef: microsoftAuthApiRef,
              },
            ]}
          />
        );
      }
      return (
        <SignInPage
          {...props}
          auto
          provider={{
            id: 'microsoft-auth-provider',
            title: 'Microsoft',
            message: 'Sign in using Microsoft',
            apiRef: microsoftAuthApiRef,
          }}
        />
      );
    },
  },
  apis,
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
});

const routes = (
  <FlatRoutes>
    <Route path="/" element={<HomepageCompositionRoot />}>
      <HomePage />
    </Route>
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />}>
      <DefaultTechDocsHome />
    </Route>
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </Route>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/catalog-import"
      element={
        <RequirePermission permission={catalogEntityCreatePermission}>
          <CatalogImportPage />
        </RequirePermission>
      }
    />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/lighthouse" element={<LighthousePage />} />
    <Route path="/devtools" element={<DevToolsPage />} />
    <Route path="/dask-onboarding" element={<DaskOnboardingPage />} />
    <Route path="/opencost" element={<OpencostPage />} />
  </FlatRoutes>
);

export default app.createRoot(
  <PostHogProvider
    apiKey="phc_RMZqNA5YC4tONx0Ri9ECA4yrYZyGmfmt2kfcIQBDNwm"
    options={{
      api_host: 'https://ph.kartverket.no',
      ui_host: 'https://eu.i.posthog.com',
      autocapture: false,
      capture_pageview: true,
    }}
  >
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <VisitListener />
      <Root>{routes}</Root>
    </AppRouter>
  </PostHogProvider>,
);

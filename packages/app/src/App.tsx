import { ExplorePage } from '@backstage-community/plugin-explore';
import { LighthousePage } from '@backstage-community/plugin-lighthouse';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FeatureFlagged, FlatRoutes } from '@backstage/core-app-api';
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
import { OpencostPage } from '@kartverket/backstage-plugin-opencost';
import { pluginRiScNorwegianTranslation } from '@kartverket/backstage-plugin-risk-scorecard';
import { Route } from 'react-router-dom';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { HomePage } from './components/home/HomePage';
import { Root } from './components/Root';
import { searchPage } from './components/search/SearchPage';
import {
  CatalogCreatorPage,
  catalogCreatorPlugin,
  catalogCreatorNorwegianTranslation,
} from '@kartverket/backstage-plugin-catalog-creator';
import { NotificationsPage } from '@backstage/plugin-notifications';
import { SignalsDisplay } from '@backstage/plugin-signals';
import {
  functionPageNorwegianTranslation,
  homepageNorwegianTranslation,
  sidebarNorwegianTranslation,
} from './utils/translations';
import { FunctionsPage } from './components/functions/FunctionsPage';
import {
  functionGroupPageNorwegianTranslation,
  SupportButton,
  supportNorwegianTranslation,
  functionLinkCardNorwegianTranslation,
} from '@internal/plugin-frontend-custom-components';

const app = createApp({
  __experimentalTranslations: {
    availableLanguages: ['en', 'no'],
    resources: [
      pluginRiScNorwegianTranslation,
      catalogCreatorNorwegianTranslation,
      sidebarNorwegianTranslation,
      homepageNorwegianTranslation,
      functionPageNorwegianTranslation,
      functionGroupPageNorwegianTranslation,
      supportNorwegianTranslation,
      functionLinkCardNorwegianTranslation,
    ],
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
      createComponent: catalogCreatorPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      // registerComponent: catalogImportPlugin.routes.importPage,
      registerComponent: catalogCreatorPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
  featureFlags: [
    {
      pluginId: '',
      name: 'show-functions-page',
      description: 'Enable the functions page',
    },
    {
      pluginId: '',
      name: 'entraid-for-status',
      description: 'Use entraid info for changing status on vulnerabilities',
    },
  ],
});

const routes = (
  <FlatRoutes>
    <Route path="/" element={<HomepageCompositionRoot />}>
      <HomePage />
    </Route>
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <FeatureFlagged with="show-functions-page">
      <Route path="/functions" element={<FunctionsPage />} />
    </FeatureFlagged>
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
    <Route
      path="/catalog-graph"
      element={
        <CatalogGraphPage
          initialState={{
            selectedKinds: ['component', 'domain', 'system', 'api', 'resource'],
          }}
        />
      }
    />
    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/lighthouse" element={<LighthousePage />} />
    <Route path="/devtools" element={<DevToolsPage />} />
    <Route path="/opencost" element={<OpencostPage />} />
    <Route
      path="/catalog-creator-function"
      element={<CatalogCreatorPage createFunction />}
    />
    <Route
      path="/catalog-creator"
      element={
        <CatalogCreatorPage
          docsLink="/docs/default/Component/kartverket.dev"
          supportButton={<SupportButton />}
        />
      }
    />
    <Route path="/notifications" element={<NotificationsPage />} />
  </FlatRoutes>
);

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <SignalsDisplay />

    <AppRouter>
      <VisitListener />
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);

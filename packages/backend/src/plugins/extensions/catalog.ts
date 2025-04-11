import { createBackendModule } from '@backstage/backend-plugin-api';
import { microsoftGraphOrgEntityProviderTransformExtensionPoint } from '@backstage/plugin-catalog-backend-module-msgraph';
import { msGraphGroupTransformer } from '../transformers/msGraphTransformer';

export const msGroupTransformerCatalogModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'microsoft-graph-extensions',
  register(env) {
    env.registerInit({
      deps: {
        microsoftGraphTransformers:
          microsoftGraphOrgEntityProviderTransformExtensionPoint,
      },
      async init({ microsoftGraphTransformers }) {
        microsoftGraphTransformers.setGroupTransformer(msGraphGroupTransformer);
      },
    });
  },
});

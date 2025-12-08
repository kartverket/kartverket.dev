// src/index.ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { FunctionEntitiesProcessor } from './processor/FunctionEntitiesProcessor';

export const catalogModuleFunctionEntities = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'function-entities',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ catalog }) {
        catalog.addProcessor(new FunctionEntitiesProcessor());
      },
    });
  },
});

export { FunctionEntitiesProcessor } from './processor/FunctionEntitiesProcessor';
export default catalogModuleFunctionEntities;

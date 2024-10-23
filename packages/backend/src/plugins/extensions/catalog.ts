import {coreServices, createBackendModule} from "@backstage/backend-plugin-api";
import {catalogProcessingExtensionPoint} from "@backstage/plugin-catalog-node/alpha";
import {SecurityChampionGroupProcessor} from "../processors/securitychampion";
import {
    microsoftGraphOrgEntityProviderTransformExtensionPoint
} from "@backstage/plugin-catalog-backend-module-msgraph";
import {msGraphGroupTransformer} from "../transformers/msGraphTransformer";

export const securityChampionsCatalogModule =
    createBackendModule({
        pluginId: 'catalog',
        moduleId: 'github-extensions',
        register(env) {
            env.registerInit({
                deps: {
                    catalog: catalogProcessingExtensionPoint,
                    config: coreServices.rootConfig
                },
                async init({ catalog, config }) {
                    catalog.addProcessor(new SecurityChampionGroupProcessor(config));
                },
            });
        },
    })

export const msGroupTransformerCatalogModule =
    createBackendModule({
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
    })
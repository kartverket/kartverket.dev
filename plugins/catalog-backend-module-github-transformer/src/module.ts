import { coreServices, createBackendModule } from '@backstage/backend-plugin-api';
import { UrlReader } from '@backstage/backend-common';
import {
  processingResult,
  CatalogProcessor,
  CatalogProcessorEmit,
  CatalogProcessorCache
} from '@backstage/plugin-catalog-node';

import {LocationSpec} from '@backstage/plugin-catalog-common';
import {Entity} from "@backstage/catalog-model";
export const catalogModuleGithubTransformer = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'github-transformer',
  register(reg) {
    reg.registerInit({
      deps: { logger: coreServices.logger },
      async init({ logger }) {
        logger.info('Hello World!')
      },
    });
  },
});


// A processor that reads from the fictional System-X
export class SystemXReaderProcessor implements CatalogProcessor {
  constructor(private readonly reader: UrlReader) {}

  getProcessorName(): string {
    return 'SystemXReaderProcessor';
  }

  async readLocation(
      location: LocationSpec,
      _optional: boolean,
      emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    // Pick a custom location type string. A location will be
    // registered later with this type.
    if (location.type !== 'Group') {
      return false;
    }

    try {
      // Use the builtin reader facility to grab data from the
      // API. If you prefer, you can just use plain fetch here
      // (from the node-fetch package), or any other method of
      // your choosing.
      return true
      // Repeatedly call emit(processingResult.entity(location, <entity>))
    } catch (error) {
      const message = `Unable to read ${location.type}, ${error}`;
      emit(processingResult.generalError(location, message));
    }

    return true;
  }
  async preProcessEntity(
      entity: Entity,
      location: LocationSpec,
      emit: CatalogProcessorEmit,
      originLocation: LocationSpec,
      cache: CatalogProcessorCache
  ): Promise<Entity> {
     if (entity.kind === 'Group' && entity.spec && entity.spec.type === 'security-champion') {
       console.log("do something")
     }
    return entity
  }


}
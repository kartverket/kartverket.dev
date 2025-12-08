import { BusinessFunction } from './BusinessFunctionType';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  Entity,
  entityKindSchemaValidator,
  getCompoundEntityRef,
  parseEntityRef,
  RELATION_CHILD_OF,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_PARENT_OF,
} from '@backstage/catalog-model';
import functionSchema from './businessFunction.schema.json';

import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';

// Creates a validator using the JSON AJV schema imported above.
const validateBusinessFunction = (entity: Entity) =>
  entityKindSchemaValidator(functionSchema)(entity) === entity;

// Processors will run against every entity in the catalog
class BusinessFunctionKindProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'BusinessFunctionKindProcessor';
  }

  postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    const selfRef = getCompoundEntityRef(entity);

    // Function for triggering relationships to be processed
    function doEmit(
      targets: string | string[] | undefined,
      context: { defaultKind?: string; defaultNamespace: string },
      outgoingRelation: string,
      incomingRelation: string,
    ): void {
      if (!targets) {
        return;
      }
      for (const target of [targets].flat()) {
        const targetRef = parseEntityRef(target, context);
        emit(
          processingResult.relation({
            source: selfRef,
            type: outgoingRelation,
            target: {
              kind: targetRef.kind,
              namespace: targetRef.namespace,
              name: targetRef.name,
            },
          }),
        );
        emit(
          processingResult.relation({
            source: {
              kind: targetRef.kind,
              namespace: targetRef.namespace,
              name: targetRef.name,
            },
            type: incomingRelation,
            target: selfRef,
          }),
        );
      }
    }

    // Adding relationships
    if (entity.kind === 'BusinessFunction') {
      const businessFunction = entity as BusinessFunction;
      doEmit(
        businessFunction.spec.parentFunction,
        { defaultKind: 'Function', defaultNamespace: selfRef.namespace },
        RELATION_CHILD_OF,
        RELATION_PARENT_OF,
      );
      doEmit(
        businessFunction.spec.childFunctions,
        { defaultKind: 'Function', defaultNamespace: selfRef.namespace },
        RELATION_PARENT_OF,
        RELATION_CHILD_OF,
      );
      doEmit(
        businessFunction.spec.childFunctions,
        { defaultKind: 'System', defaultNamespace: selfRef.namespace },
        RELATION_DEPENDS_ON,
        RELATION_DEPENDENCY_OF,
      );
    }
    return Promise.resolve(entity);
  }

  // This is is required so that the catalog will be able to ingest this new Kind
  validateEntityKind(entity: Entity): Promise<boolean> {
    if (entity.kind === 'BusinessFunction') {
      return Promise.resolve(validateBusinessFunction(entity));
    }
    return Promise.resolve(false);
  }
}

export const catalogModuleFunctionKind = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'your-kind',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ catalog }) {
        catalog.addProcessor(new BusinessFunctionKindProcessor());
      },
    });
  },
});

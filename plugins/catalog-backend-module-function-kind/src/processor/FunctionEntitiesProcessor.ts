import {
  CatalogProcessor,
  CatalogProcessorEmit,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  Entity,
  getCompoundEntityRef,
  parseEntityRef,
  RELATION_CHILD_OF,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PARENT_OF,
} from '@backstage/catalog-model';
import { entityKindSchemaValidator } from '@backstage/catalog-model';
import {
  FunctionEntityV1alpha1,
  isFunctionEntity,
  functionEntityV1alpha1Validator,
} from '@internal/plugin-function-kind-common';

/**
 * Processor for Function entities
 *
 * This processor:
 * - Validates Function entities against their schema
 * - Emits relations between functions and their owners/systems
 * - Can add default annotations or perform transformations
 */
export class FunctionEntitiesProcessor implements CatalogProcessor {
  private readonly validators = [
    entityKindSchemaValidator(functionEntityV1alpha1Validator),
  ];

  /**
   * Return the processor name for logging and debugging
   */
  getProcessorName(): string {
    return 'FunctionEntitiesProcessor';
  }

  /**
   * Validate that an entity is a Function entity
   * This is called during entity ingestion to determine if this processor
   * should handle the entity
   */
  async validateEntityKind(entity: Entity): Promise<boolean> {
    for (const validator of this.validators) {
      try {
        if (await validator(entity)) {
          return true;
        }
      } catch (e) {
        // If validation fails, the error will be shown to the user
        throw e;
      }
    }

    return false;
  }

  /**
   * Pre-process the entity before it's stored in the catalog
   * This is where you can add default values, normalize data, etc.
   */
  async preProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    _emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    // Only process Function entities
    if (!isFunctionEntity(entity)) {
      return entity;
    }

    // Add default annotations if not present
    const annotations = entity.metadata.annotations || {};

    return {
      ...entity,
      metadata: {
        ...entity.metadata,
        annotations,
      },
    };
  }

  /**
   * Post-process the entity after it's been validated
   * This is where you emit relations to other entities
   */
  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    // Only process Function entities
    if (!isFunctionEntity(entity)) {
      return entity;
    }
    const selfRef = getCompoundEntityRef(entity);

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

    const functionEntity = entity as FunctionEntityV1alpha1;

    doEmit(
      functionEntity.spec.owner,
      { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
      RELATION_OWNED_BY,
      RELATION_OWNER_OF,
    );

    doEmit(
      functionEntity.spec.dependsOnSystems,
      { defaultKind: 'System', defaultNamespace: selfRef.namespace },
      RELATION_DEPENDS_ON,
      RELATION_DEPENDENCY_OF,
    );

    doEmit(
      functionEntity.spec.dependsOnComponents,
      { defaultKind: 'Component', defaultNamespace: selfRef.namespace },
      RELATION_DEPENDS_ON,
      RELATION_DEPENDENCY_OF,
    );

    doEmit(
      functionEntity.spec.childFunctions,
      { defaultKind: 'Function', defaultNamespace: selfRef.namespace },
      RELATION_PARENT_OF,
      RELATION_CHILD_OF,
    );

    doEmit(
      functionEntity.spec.dependsOnFunctions,
      { defaultKind: 'Function', defaultNamespace: selfRef.namespace },
      RELATION_DEPENDS_ON,
      RELATION_DEPENDENCY_OF,
    );

    return entity;
  }
}

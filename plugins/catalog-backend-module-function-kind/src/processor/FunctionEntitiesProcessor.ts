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
  RELATION_HAS_PART,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PARENT_OF,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import { entityKindSchemaValidator } from '@backstage/catalog-model';
import {
  FunctionEntityV1alpha1,
  isFunctionEntity,
  functionEntityV1alpha1Validator,
} from '@internal/plugin-test-new-kind-common';

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

    // Example: Add a default annotation for monitoring
    if (!annotations['mycompany.net/monitoring-enabled']) {
      annotations['mycompany.net/monitoring-enabled'] = 'true';
    }

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
      functionEntity.spec.system,
      { defaultKind: 'System', defaultNamespace: selfRef.namespace },
      RELATION_PART_OF,
      RELATION_HAS_PART,
    );

    doEmit(
      functionEntity.spec.childSystems,
      { defaultKind: 'System', defaultNamespace: selfRef.namespace },
      RELATION_PARENT_OF,
      RELATION_CHILD_OF,
    );

    doEmit(
      functionEntity.spec.childFunctions,
      { defaultKind: 'Function', defaultNamespace: selfRef.namespace },
      RELATION_PARENT_OF,
      RELATION_CHILD_OF,
    );

    // Emit system relation if system is specified
    // This creates a link: Function --partOf--> System

    // Example: Emit a custom relation for functions in the same region
    // This could be useful for showing related functions
    if (functionEntity.spec.region) {
      emit(
        processingResult.relation({
          source: {
            kind: functionEntity.kind,
            namespace: functionEntity.metadata.namespace || 'default',
            name: functionEntity.metadata.name,
          },
          type: 'regionOf',
          target: {
            kind: 'resource',
            namespace: 'default',
            name: `region-${functionEntity.spec.region}`,
          },
        }),
      );
    }

    return entity;
  }
}

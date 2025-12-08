import {
  CatalogProcessor,
  CatalogProcessorEmit,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { Entity } from '@backstage/catalog-model';
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

    const functionEntity = entity as FunctionEntityV1alpha1;

    // Emit ownership relation
    // This creates a link: Function --ownedBy--> Group/User
    // Parse owner format: "group:skvis" or "user:john" or "group:default/skvis"
    const ownerParts = functionEntity.spec.owner.split(':');
    const ownerKind = ownerParts[0] || 'group';
    const ownerRef = ownerParts[1] || functionEntity.spec.owner;
    const ownerNameParts = ownerRef.split('/');
    const ownerNamespace =
      ownerNameParts.length > 1 ? ownerNameParts[0] : 'default';
    const ownerName =
      ownerNameParts.length > 1 ? ownerNameParts[1] : ownerNameParts[0];

    emit(
      processingResult.relation({
        source: {
          kind: functionEntity.kind,
          namespace: functionEntity.metadata.namespace || 'default',
          name: functionEntity.metadata.name,
        },
        type: 'ownedBy',
        target: {
          kind: ownerKind,
          namespace: ownerNamespace,
          name: ownerName,
        },
      }),
    );

    // Emit system relation if system is specified
    // This creates a link: Function --partOf--> System
    if (functionEntity.spec.system) {
      emit(
        processingResult.relation({
          source: {
            kind: functionEntity.kind,
            namespace: functionEntity.metadata.namespace || 'default',
            name: functionEntity.metadata.name,
          },
          type: 'partOf',
          target: {
            kind: 'system',
            namespace: 'default',
            name: functionEntity.spec.system,
          },
        }),
      );
    }

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

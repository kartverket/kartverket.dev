/**
 * Common functionalities for the test-new-kind plugin.
 *
 * @packageDocumentation
 */

import { Entity } from '@backstage/catalog-model';

// Export schema validators
export { functionEntityV1alpha1Validator, schemas } from './schema';

/**
 * Database entity definition - version 1 alpha 1
 *
 * This represents a database instance in your infrastructure
 */
export interface FunctionEntityV1alpha1 extends Entity {
  apiVersion: 'mycompany.net/v1alpha1';
  kind: 'Database';
  spec: {
    /**
     * The type of database (e.g., 'postgres', 'mysql', 'mongodb')
     */
    type: string;

    /**
     * The lifecycle stage of the database
     */
    lifecycle: string;

    /**
     * The owner of the database - typically a team
     */
    owner: string;

    /**
     * Optional: The system this database belongs to
     */
    system?: string;

    /**
     * Optional: Connection endpoint (without credentials)
     */
    endpoint?: string;

    /**
     * Optional: Cloud provider where this database is hosted
     */
    provider?: 'aws' | 'gcp' | 'azure' | 'on-premise';

    /**
     * Optional: Region where the database is deployed
     */
    region?: string;
  };
}

/**
 * Type guard to check if an entity is a DatabaseEntity
 */
export function isFunctionEntity(
  entity: Entity,
): entity is FunctionEntityV1alpha1 {
  return (
    entity.apiVersion === 'mycompany.net/v1alpha1' && entity.kind === 'Database'
  );
}

/**
 * Constants for Database entity
 */
export const FUNCTION_ENTITY_KIND = 'Database';
export const FUNCTION_API_VERSION = 'mycompany.net/v1alpha1';

/**
 * Well-known database types
 */
export const FUNCTION_TYPES = {
  VIKTIKGFUNKSJON: 'Viktigfunksjon',
} as const;

export type FunctionType = (typeof FUNCTION_TYPES)[keyof typeof FUNCTION_TYPES];

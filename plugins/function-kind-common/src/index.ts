/**
 * Common functionalities for the test-new-kind plugin.
 *
 * @packageDocumentation
 */

import { Entity } from '@backstage/catalog-model';

// Export schema validators
export { functionEntityV1alpha1Validator, schemas } from './schema';

/**
 * Function entity definition - version 1 alpha 1
 *
 * This represents a function instance in your infrastructure
 */
export interface FunctionEntityV1alpha1 extends Entity {
  apiVersion: 'kartverket.dev/v1alpha1';
  kind: 'Function';
  spec: {
    /**
     * The owner of the function - typically a team
     */
    owner: string;

    /**
     * How critical the function is - typically "High", "Medium" or "Low"
     */
    criticality: string;

    /**
     * Optional: The systems this function depends on
     */
    dependsOnSystems?: string[];

    /**
     * Optional: The systems this function depends on
     */
    dependsOnComponents?: string[];

    /**
     * Optional: The function this function is a parent of
     */
    parentFunction?: string;

    /**
     * Optional: The functions this function depends on.
     */
    dependsOnFunctions?: string[];
  };
}

/**
 * Type guard to check if an entity is a functionEntity
 */
export function isFunctionEntity(
  entity: Entity,
): entity is FunctionEntityV1alpha1 {
  return (
    entity.apiVersion === 'kartverket.dev/v1alpha1' &&
    entity.kind === 'Function'
  );
}

/**
 * Constants for function entity
 */
export const FUNCTION_ENTITY_KIND = 'Function';
export const FUNCTION_API_VERSION = 'kartverket.dev/v1alpha1';

/**
 * Well-known function types
 */
export const FUNCTION_TYPES = {} as const;

export type FunctionType = (typeof FUNCTION_TYPES)[keyof typeof FUNCTION_TYPES];

/**
 * JSON Schemas for custom entity kinds
 */

import functionEntityV1alpha1Schema from './kinds/FunctionEntityV1Alpha1.schema.json';

/**
 * Export the schema for use in processors
 */
export const functionEntityV1alpha1Validator = functionEntityV1alpha1Schema;

/**
 * All schemas for this plugin
 */
export const schemas = {
  functionEntityV1alpha1: functionEntityV1alpha1Schema,
} as const;

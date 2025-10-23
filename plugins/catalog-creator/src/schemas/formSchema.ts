import * as z from 'zod/v4';
import { AllowedLifecycleStages } from '../model/types';

const baseEntitySchema = z.object({
  id: z.number(),
  kind: z.string,
  name: z
    .string()
    .trim()
    .min(1, 'Add a name')
    .refine(s => !s.includes(' '), { message: 'Name cannot contain space' })
    .refine(
      s =>
        !/^[.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]|[.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]$/.test(
          s,
        ),
      'Name cannot start or end with special characters',
    ),
  owner: z
    .string()
    .trim()
    .min(1, 'Add an owner')
    .refine(s => !s.includes(' '), { message: 'Owner cannot contain space' }),
  title: z.string().optional(),
});

export const componentSchema = baseEntitySchema.extend({
  kind: z.literal('Component'),
  system: z.optional(
    z
      .string()
      .trim()
      .refine(s => !s.includes(' '), {
        message: 'System cannot contain space',
      }),
  ),

  lifecycle: z.enum(AllowedLifecycleStages, { message: 'Choose a lifecycle' }),
  entityType: z
    .string('Add a type')
    .trim()
    .min(1, 'Add a type')
    .refine(s => !s.includes(' '), { message: 'Type cannot contain space' }),
  subcomponentOf: z.string().optional(),
  providesApis: z
    .array(z.string())
    .refine(
      entries =>
        entries.every(entry => entry.trim().length > 0 && !entry.includes(' ')),
      { message: 'APIs cannot contain space' },
    )
    .optional(),
  consumesApis: z
    .array(z.string())
    .refine(
      entries =>
        entries.every(entry => entry.trim().length > 0 && !entry.includes(' ')),
      { message: 'APIs cannot contain space' },
    )
    .optional(),
  dependsOn: z
    .array(z.string())
    .refine(
      entries =>
        entries.every(entry => entry.trim().length > 0 && !entry.includes(' ')),
      { message: 'Dependencies cannot contain space' },
    )
    .optional(),
  depencencyOf: z.array(z.string()).optional(),
});

export const apiSchema = baseEntitySchema.extend({
  kind: z.literal('API'),

  lifecycle: z.enum(AllowedLifecycleStages, { message: 'Choose a lifecycle' }),
  entityType: z
    .string('Add a type')
    .trim()
    .min(1, 'Add a type')
    .refine(s => !s.includes(' '), { message: 'Type cannot contain space' }),
  system: z.optional(
    z
      .string()
      .trim()
      .refine(s => !s.includes(' '), {
        message: 'System cannot contain space',
      }),
  ),
  definition: z.optional(
    z
      .string()
      .trim()
      .refine(s => !s.includes(' '), {
        message: 'Definition URL cannot contain space',
      }),
  ),
});

export const templateSchema = baseEntitySchema.extend({
  kind: z.literal('Template'),
});

export const systemSchema = baseEntitySchema.extend({
  kind: z.literal('System'),
  entityType: z.optional(
    z
      .string()
      .trim()
      .refine(s => !s.includes(' '), {
        message: 'Type cannot contain space',
      }),
  ),
  domain: z.optional(
    z
      .string()
      .trim()
      .refine(s => !s.includes(' '), {
        message: 'Domain cannot contain space',
      }),
  ),
});

export const domainSchema = baseEntitySchema.extend({
  kind: z.literal('Domain'),
});

export const resourceSchema = baseEntitySchema.extend({
  kind: z.literal('Resource'),
});

export const entitySchema = z.discriminatedUnion('kind', [
  componentSchema,
  apiSchema,
  templateSchema,
  systemSchema,
  domainSchema,
  resourceSchema,
]);

export const formSchema = z.object({
  entities: z.array(entitySchema).min(1, 'At least one entity is required'),
});

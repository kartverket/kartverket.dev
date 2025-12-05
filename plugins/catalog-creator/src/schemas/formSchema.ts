import * as z from 'zod/v4';
import { AllowedLifecycleStages } from '../types/types';

const baseEntitySchema = z.object({
  id: z.number(),
  kind: z.string,
  name: z
    .string()
    .trim()
    .min(1, 'form.errors.noName')
    .refine(s => !s.includes(' '), { message: 'form.errors.nameNoSpace' })
    .refine(
      s =>
        !/^[.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]|[.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]$/.test(
          s,
        ),
      'form.errors.ownerNoSpace',
    ),
  title: z.string().optional(),
  tags: z
    .array(z.string())
    .refine(
      entries =>
        entries.every(entry => entry.trim().length > 0 && !entry.includes(' ')),
      { message: 'form.errors.tagNoSpace' },
    )
    .refine(
      entries =>
        entries.every(
          entry =>
            entry.trim().length <= 63 &&
            /^[a-z0-9:+#]+(-[a-z0-9:+#]+)*$/.test(entry),
        ),
      {
        message: 'form.errors.tagRegEx',
      },
    )
    .optional(),
});

export const componentSchema = baseEntitySchema.extend({
  kind: z.literal('Component'),
  owner: z
    .string()
    .trim()
    .min(1, 'form.errors.noOwner')
    .refine(s => !s.includes(' '), { message: 'form.errors.ownerNoSpace' }),
  system: z.optional(
    z
      .string()
      .trim()
      .refine(s => !s.includes(' '), {
        message: 'form.errors.systemNoSpace',
      }),
  ),

  lifecycle: z.enum(AllowedLifecycleStages, {
    message: 'form.errors.noLifecycle',
  }),
  entityType: z
    .string('form.errors.noType')
    .trim()
    .min(1, 'form.errors.noType')
    .refine(s => !s.includes(' '), { message: 'form.errors.typeNoSpace' }),
  subcomponentOf: z.string().optional(),
  providesApis: z
    .array(z.string())
    .refine(
      entries =>
        entries.every(entry => entry.trim().length > 0 && !entry.includes(' ')),
      { message: 'form.errors.APIsNoSpace' },
    )
    .optional(),
  consumesApis: z
    .array(z.string())
    .refine(
      entries =>
        entries.every(entry => entry.trim().length > 0 && !entry.includes(' ')),
      { message: 'form.errors.APIsNoSpace' },
    )
    .optional(),
  dependsOn: z
    .array(z.string())
    .refine(
      entries =>
        entries.every(entry => entry.trim().length > 0 && !entry.includes(' ')),
      { message: 'form.errors.dependenciesNoSpace' },
    )
    .optional(),
  depencencyOf: z.array(z.string()).optional(),
});

export const apiSchema = baseEntitySchema.extend({
  kind: z.literal('API'),
  owner: z
    .string()
    .trim()
    .min(1, 'form.errors.noOwner')
    .refine(s => !s.includes(' '), { message: 'form.errors.ownerNoSpace' }),
  lifecycle: z.enum(AllowedLifecycleStages, {
    message: 'form.errors.noLifecycle',
  }),
  entityType: z
    .string('form.errors.noType')
    .trim()
    .min(1, 'form.errors.noType')
    .refine(s => !s.includes(' '), { message: 'form.errors.typeNoSpace' }),
  system: z.optional(
    z
      .string()
      .trim()
      .refine(s => !s.includes(' '), {
        message: 'form.errors.systemNoSpace',
      }),
  ),
  definition: z
    .string('form.errors.noDefinition')
    .trim()
    .min(1, 'form.errors.noDefinition')
    .refine(s => !s.includes(' '), {
      message: 'form.errors.definitionNoSpace',
    }),
});

export const systemSchema = baseEntitySchema.extend({
  kind: z.literal('System'),
  owner: z
    .string()
    .trim()
    .min(1, 'form.errors.noOwner')
    .refine(s => !s.includes(' '), { message: 'form.errors.ownerNoSpace' }),
  entityType: z.optional(
    z
      .string()
      .trim()
      .refine(s => !s.includes(' '), {
        message: 'form.errors.typeNoSpace',
      }),
  ),
  domain: z.optional(
    z
      .string()
      .trim()
      .refine(s => !s.includes(' '), {
        message: 'form.errors.domainNoSpace',
      }),
  ),

  systemType: z.optional(z.string()),
});

export const resourceSchema = baseEntitySchema.extend({
  kind: z.literal('Resource'),
  owner: z
    .string()
    .trim()
    .min(1, 'form.errors.noOwner')
    .refine(s => !s.includes(' '), { message: 'form.errors.ownerNoSpace' }),
  entityType: z
    .string('form.errors.noType')
    .trim()
    .min(1, 'form.errors.noType')
    .refine(s => !s.includes(' '), { message: 'form.errors.typeNoSpace' }),

  system: z.optional(
    z
      .string()
      .trim()
      .refine(s => !s.includes(' '), {
        message: 'form.errors.systemNoSpace',
      }),
  ),
  dependencyOf: z
    .array(z.string())
    .refine(
      entries =>
        entries.every(entry => entry.trim().length > 0 && !entry.includes(' ')),
      { message: 'form.errors.dependenciesNoSpace' },
    )
    .optional(),
});

export const domainSchema = baseEntitySchema.extend({
  kind: z.literal('Domain'),
  owner: z
    .string()
    .trim()
    .min(1, 'form.errors.noOwner')
    .refine(s => !s.includes(' '), { message: 'form.errors.ownerNoSpace' }),
  entityType: z
    .string('form.errors.noType')
    .trim()
    .min(1, 'form.errors.noType')
    .refine(s => !s.includes(' '), { message: 'form.errors.typeNoSpace' }),
});

export const templateSchema = baseEntitySchema.extend({
  kind: z.literal('Template'),
});

export const groupSchema = baseEntitySchema.extend({
  kind: z.literal('Group'),
});

export const userSchema = baseEntitySchema.extend({
  kind: z.literal('User'),
});

export const locationSchema = baseEntitySchema.extend({
  kind: z.literal('Location'),
});

export const entitySchema = z.discriminatedUnion('kind', [
  componentSchema,
  apiSchema,
  templateSchema,
  systemSchema,
  domainSchema,
  resourceSchema,
  groupSchema,
  userSchema,
  locationSchema,
]);

export const formSchema = z.object({
  entities: z.array(entitySchema).min(1, 'At least one entity is required'),
});

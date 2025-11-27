import z from 'zod/v4';
import { RequiredYamlFields } from '../types/types.ts';
import yaml from 'yaml';
import { entitySchema } from '../schemas/formSchema.ts';

export const updateYaml = (
  initial: RequiredYamlFields,
  form: z.infer<typeof entitySchema>,
): string => {
  let updated: RequiredYamlFields;

  switch (form.kind) {
    case 'Component':
      updated = {
        ...initial,
        kind: form.kind || initial.kind,
        metadata: {
          ...initial.metadata,
          name: form.name || initial.metadata.name,
          title: form?.title || initial.metadata?.title || undefined,
          tags: form?.tags || initial.metadata?.tags || undefined,
        },
        spec: {
          ...initial.spec,
          owner: form.owner || initial.spec.owner || undefined,
          lifecycle: form.lifecycle || initial.spec.lifecycle || undefined,
          system: form.system?.length
            ? form.system
            : initial.spec.system || undefined,
          type: form.entityType! || initial.spec.type,
          providesApis: form.providesApis?.length
            ? form.providesApis
            : initial.spec.providesApis || undefined,
          consumesApis: form.consumesApis?.length
            ? form.consumesApis
            : initial.spec.consumesApis || undefined,
          dependsOn: form.dependsOn?.length
            ? form.dependsOn
            : initial.spec.dependsOn || undefined,
        },
      };
      break;
    case 'API': {
      let definition;

      if (form.definition) {
        definition = { $text: form.definition };
      } else if (initial.spec.definition !== 'string') {
        definition = initial.spec.definition;
      } else {
        definition = initial.spec.definition || undefined;
      }

      updated = {
        ...initial,
        kind: form.kind || initial.kind,
        metadata: {
          ...initial.metadata,
          name: form.name || initial.metadata.name,
          title: form?.title || initial.metadata?.title || undefined,
          tags: form?.tags || initial.metadata?.tags || undefined,
        },
        spec: {
          ...initial.spec,
          owner: form.owner || initial.spec.owner || undefined,
          lifecycle: form.lifecycle || initial.spec.lifecycle || undefined,
          system: form.system?.length
            ? form.system
            : initial.spec.system || undefined,
          type: form.entityType! || initial.spec.type,
          definition: definition,
        },
      };
      break;
    }
    case 'System':
      updated = {
        ...initial,
        kind: form.kind || initial.kind,
        metadata: {
          ...initial.metadata,
          name: form.name || initial.metadata.name,
          title: form?.title || initial.metadata?.title || undefined,
          tags: form?.tags || initial.metadata?.tags || undefined,
        },
        spec: {
          ...initial.spec,
          owner: form.owner || initial.spec.owner || undefined,
          type: form.entityType?.length
            ? form.entityType
            : initial.spec.entityType || undefined,
          domain: form.domain?.length
            ? form.domain
            : initial.spec.domain || undefined,
        },
      };
      break;
    case 'Domain':
      updated = {
        ...initial,
        kind: form.kind || initial.kind,
        metadata: {
          ...initial.metadata,
          name: form.name || initial.metadata.name,
          title: form?.title || initial.metadata?.title || undefined,
          tags: form?.tags || initial.metadata?.tags || undefined,
        },
        spec: {
          ...initial.spec,
          owner: form.owner || initial.spec.owner || undefined,
          type: form.entityType?.length
            ? form.entityType
            : initial.spec.entityType || undefined,
        },
      };
      break;
    case 'Resource':
      updated = {
        ...initial,
        kind: form.kind || initial.kind,
        metadata: {
          ...initial.metadata,
          name: form.name || initial.metadata.name,
          title: form?.title || initial.metadata?.title || undefined,
          tags: form?.tags || initial.metadata?.tags || undefined,
        },
        spec: {
          ...initial.spec,
          owner: form.owner || initial.spec.owner || undefined,
          type: form.entityType?.length
            ? form.entityType
            : initial.spec.entityType || undefined,
          system: form.system?.length
            ? form.system
            : initial.spec.system || undefined,
          dependencyof: form.dependencyof?.length
            ? form.dependencyof
            : initial.spec.dependencyof || undefined,
        },
      };
      break;

    default:
      updated = {
        ...initial,
        kind: form.kind || initial.kind,
        metadata: {
          ...initial.metadata,
          name: form.name || initial.metadata.name,
          title: form?.title || initial.metadata?.title || undefined,
          tags: form?.tags || initial.metadata?.tags || undefined,
        },
        spec: {
          ...initial.spec,
        },
      };
  }
  return yaml.stringify(updated);
};

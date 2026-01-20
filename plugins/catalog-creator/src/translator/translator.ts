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
          tags:
            form.tags?.length === 0
              ? undefined
              : form.tags || initial.spec.tags,
        },
        spec: {
          ...initial.spec,
          owner: form.owner || initial.spec.owner || undefined,
          lifecycle: form.lifecycle || initial.spec.lifecycle || undefined,
          system:
            form.system?.length === 0
              ? undefined
              : form.system || initial.spec.system,
          type: form.entityType! || initial.spec.type,
          providesApis:
            form.providesApis?.length === 0
              ? undefined
              : form.providesApis || initial.spec.providesApis,
          consumesApis:
            form.consumesApis?.length === 0
              ? undefined
              : form.consumesApis || initial.spec.consumesApis,
          dependsOn:
            form.dependsOn?.length === 0
              ? undefined
              : form.dependsOn || initial.spec.dependsOn,
        },
      };
      break;
    case 'API': {
      let definition;

      if (form.definition) {
        if (
          initial.spec.definition &&
          typeof initial.spec.definition !== 'string'
        ) {
          switch (true) {
            case Object.hasOwn(initial.spec.definition, '$openapi'):
              definition = { $openapi: form.definition };
              break;
            case Object.hasOwn(initial.spec.definition, '$graphql'):
              definition = { $graphql: form.definition };
              break;
            case Object.hasOwn(initial.spec.definition, '$asyncapi'):
              definition = { $asyncapi: form.definition };
              break;
            default:
              definition = { $text: form.definition };
          }
        } else {
          definition = { $text: form.definition };
        }
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
          tags:
            form.tags?.length === 0
              ? undefined
              : form.tags || initial.spec.tags,
        },
        spec: {
          ...initial.spec,
          owner: form.owner || initial.spec.owner || undefined,
          lifecycle: form.lifecycle || initial.spec.lifecycle || undefined,
          system:
            form.system?.length === 0
              ? undefined
              : form.system || initial.spec.system,
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
          tags:
            form.tags?.length === 0
              ? undefined
              : form.tags || initial.spec.tags,
        },
        spec: {
          ...initial.spec,
          owner: form.owner || initial.spec.owner || undefined,
          type:
            form.entityType?.length === 0
              ? undefined
              : form.entityType || initial.spec.type,
          domain:
            form.domain?.length === 0
              ? undefined
              : form.domain || initial.spec.domain,
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
          tags:
            form.tags?.length === 0
              ? undefined
              : form.tags || initial.spec.tags,
        },
        spec: {
          ...initial.spec,
          owner: form.owner || initial.spec.owner || undefined,
          type:
            form.entityType?.length === 0
              ? undefined
              : form.entityType || initial.spec.type,
          subdomainOf:
            form.subdomainOf?.length === 0
              ? undefined
              : form.subdomainOf || initial.spec.subdomainOf,
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
          tags:
            form.tags?.length === 0
              ? undefined
              : form.tags || initial.spec.tags,
        },
        spec: {
          ...initial.spec,
          owner: form.owner || initial.spec.owner || undefined,
          type:
            form.entityType?.length === 0
              ? undefined
              : form.entityType || initial.spec.type,
          system:
            form.system?.length === 0
              ? undefined
              : form.system || initial.spec.system,
          dependencyOf:
            form.dependencyOf?.length === 0
              ? undefined
              : form.dependencyOf || initial.spec.dependencyOf,
        },
      };
      break;
    case 'Function':
      updated = {
        ...initial,
        kind: form.kind || initial.kind,
        metadata: {
          ...initial.metadata,
          name: form.name || initial.metadata.name,
          title: form?.title || initial.metadata?.title || undefined,
          tags:
            form.tags?.length === 0
              ? undefined
              : form.tags || initial.spec.tags,
          links:
            form.links?.length === 0
              ? undefined
              : form.links || initial.spec.links,
        },
        spec: {
          ...initial.spec,
          owner: form.owner || initial.spec.owner || undefined,
          type:
            form.entityType?.length === 0
              ? undefined
              : form.entityType || initial.spec.type,

          dependsOnSystems:
            form.dependsOnSystems?.length === 0
              ? undefined
              : form.dependsOnSystems || initial.spec.dependsOnSystems,
          dependsOnComponents:
            form.dependsOnComponents?.length === 0
              ? undefined
              : form.dependsOnComponents || initial.spec.dependsOnComponents,
          dependsOnFunctions:
            form.dependsOnFunctions?.length === 0
              ? undefined
              : form.dependsOnFunctions || initial.spec.dependsOnFunctions,
          parentFunction:
            form.parentFunction?.length === 0
              ? undefined
              : form.parentFunction || initial.spec.parentFunction,
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

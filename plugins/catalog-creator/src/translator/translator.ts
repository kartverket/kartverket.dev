import type { CatalogInfoForm, RequiredYamlFields } from '../model/types.ts';
import yaml from 'yaml';

export const updateYaml = (initial: RequiredYamlFields, form: CatalogInfoForm): string => {

    console.log('Initial YAML content:', yaml.stringify(initial));

    const updated: RequiredYamlFields = {
        ...initial,
        metadata: {
            ...initial.metadata,
            name: form.name,
        },
        spec: {
            ...initial.spec,
            owner: form.owner,
            lifecycle: form.lifecycle || undefined,
            system: form.system?.length ? form.system : undefined,
            domain: form.domain?.length ? form.domain : undefined,
            providesApis: form.providesApis?.length ? form.providesApis : undefined,
            consumesApis: form.consumesApis?.length ? form.consumesApis : undefined,
            dependsOn: form.dependsOn?.length ? form.dependsOn : undefined,
            definition: form.definition?.length ? form.definition : undefined,
        }
    };

    console.log('Generated YAML content:', yaml.stringify(updated));

    const yamlContent = yaml.stringify(updated);

    return yamlContent;
};
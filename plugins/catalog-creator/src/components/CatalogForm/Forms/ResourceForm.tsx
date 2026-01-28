import { Flex } from '@backstage/ui';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';
import { EntityErrors, ResourceTypes } from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { useUpdateDependentFormFields } from '../../../hooks/useUpdateDependentFormFields';
import { TagField } from '../Autocompletes/TagField';
import { SingleEntityAutocomplete } from '../Autocompletes/SingleEntityAutocomplete';
import { SingleSelectAutocomplete } from '../Autocompletes/SingleSelectAutocomplete';
import { MultipleEntitiesAutocomplete } from '../Autocompletes/MultipleEntitiesAutocomplete';

export type ResourceFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  setValue: UseFormSetValue<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Resource'>;
  systems: {
    loading: boolean;
    error: Error | undefined;
    value: Entity[];
  };
  groups: {
    loading: boolean;
    error: Error | undefined;
    value: Entity[];
  };
  componentsAndResources: {
    loading: boolean;
    error: Error | undefined;
    value: Entity[];
  };
};

export const ResourceForm = ({
  index,
  control,
  setValue,
  errors,
  systems,
  groups,
  componentsAndResources,
}: ResourceFormProps) => {
  const systemVal = useWatch({
    control,
    name: `entities.${index}.system`,
  });
  const dependencyOfVal = useWatch({
    control,
    name: `entities.${index}.dependencyOf`,
  });

  useUpdateDependentFormFields(
    systems,
    typeof systemVal === 'string' ? [systemVal] : undefined,
    `entities.${index}.system`,
    setValue,
    true,
  );
  useUpdateDependentFormFields(
    componentsAndResources,
    dependencyOfVal,
    `entities.${index}.dependencyOf`,
    setValue,
  );

  return (
    <Flex direction="column" justify="start">
      <div>
        <SingleEntityAutocomplete
          index={index}
          control={control}
          errors={errors}
          fieldname="owner"
          entities={groups.value || []}
          required
        />
      </div>
      <Flex>
        <div style={{ flexGrow: 1, width: '50%' }}>
          <SingleSelectAutocomplete
            index={index}
            control={control}
            errors={errors}
            formname="resourceForm"
            fieldname="entityType"
            freeSolo
            options={Object.values(ResourceTypes)}
            required
          />
        </div>
      </Flex>
      <div>
        <SingleEntityAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="componentForm"
          fieldname="system"
          entities={systems.value || []}
        />
      </div>
      <div>
        <MultipleEntitiesAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="resourceForm"
          fieldname="dependencyOf"
          entities={componentsAndResources.value || []}
        />
      </div>
      <TagField index={index} control={control} errors={errors} options={[]} />
    </Flex>
  );
};

import { Flex } from '@backstage/ui';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';
import {
  AllowedLifecycleStages,
  ComponentTypes,
  EntityErrors,
  Kinds,
} from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { useFetchEntities } from '../../../hooks/useFetchEntities';
import { useUpdateDependentFormFields } from '../../../hooks/useUpdateDependentFormFields';
import { TagField } from '../Autocompletes/TagField';
import { SingleSelectAutocomplete } from '../Autocompletes/SingleSelectAutocomplete';
import { SingleEntityAutocomplete } from '../Autocompletes/SingleEntityAutocomplete';
import { MultipleEntitiesAutocomplete } from '../Autocompletes/MultipleEntitiesAutocomplete';

export type ComponentFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  setValue: UseFormSetValue<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Component'>;
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

export const ComponentForm = ({
  index,
  control,
  setValue,
  errors,
  systems,
  groups,
  componentsAndResources,
}: ComponentFormProps) => {
  const fetchAPIs = useFetchEntities(control, 'API');

  const systemVal = useWatch({
    control,
    name: `entities.${index}.system`,
  });

  const providesApisVal = useWatch({
    control,
    name: `entities.${index}.providesApis`,
  });

  const consumesApisVal = useWatch({
    control,
    name: `entities.${index}.consumesApis`,
  });

  const dependsOnVal = useWatch({
    control,
    name: `entities.${index}.dependsOn`,
  });

  useUpdateDependentFormFields(
    systems,
    typeof systemVal === 'string' ? [systemVal] : undefined,
    `entities.${index}.system`,
    setValue,
    true,
  );

  useUpdateDependentFormFields(
    fetchAPIs,
    providesApisVal,
    `entities.${index}.providesApis`,
    setValue,
  );

  useUpdateDependentFormFields(
    fetchAPIs,
    consumesApisVal,
    `entities.${index}.consumesApis`,
    setValue,
  );

  useUpdateDependentFormFields(
    componentsAndResources,
    dependsOnVal,
    `entities.${index}.dependsOn`,
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
        <div style={{ width: '50%' }}>
          <SingleSelectAutocomplete
            index={index}
            control={control}
            errors={errors}
            formname="componentForm"
            fieldname="lifecycle"
            options={Object.values(AllowedLifecycleStages)}
            required
          />
        </div>

        <div style={{ flexGrow: 1, width: '50%' }}>
          <SingleSelectAutocomplete
            index={index}
            control={control}
            errors={errors}
            formname="componentForm"
            fieldname="entityType"
            options={Object.values(ComponentTypes)}
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
          formname="componentForm"
          fieldname="providesApis"
          entities={fetchAPIs.value || []}
          kind={Kinds.API}
        />
      </div>
      <div>
        <MultipleEntitiesAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="componentForm"
          fieldname="consumesApis"
          entities={fetchAPIs.value || []}
        />
      </div>
      <div>
        <MultipleEntitiesAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="componentForm"
          fieldname="dependsOn"
          entities={componentsAndResources.value || []}
        />
      </div>
      <TagField
        index={index}
        control={control}
        errors={errors}
        options={['internal', 'private', 'public']}
      />
    </Flex>
  );
};

import { Flex } from '@backstage/ui';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';
import { EntityErrors, FunctionTypes } from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { TagField } from '../Autocompletes/TagField';
import { SingleEntityAutocomplete } from '../Autocompletes/SingleEntityAutocomplete';
import { SingleSelectAutocomplete } from '../Autocompletes/SingleSelectAutocomplete';
import { MultipleEntitiesAutocomplete } from '../Autocompletes/MultipleEntitiesAutocomplete';
import { useUpdateDependentFormFields } from '../../../hooks/useUpdateDependentFormFields';

export type FunctionFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Function'>;
  groups: Entity[];
  setValue: UseFormSetValue<z.infer<typeof formSchema>>;
  components: Entity[];
  functions: Entity[];
  systems: Entity[];
};

export const FunctionForm = ({
  index,
  control,
  errors,
  groups,
  setValue,
  components,
  functions,
  systems,
}: FunctionFormProps) => {
  const systemVal = useWatch({
    control,
    name: `entities.${index}.system`,
  });

  const functionVal = useWatch({
    control,
    name: `entities.${index}.dependsOnFunctions`,
  });

  const componentVal = useWatch({
    control,
    name: `entities.${index}.dependsOnComponents`,
  });

  useUpdateDependentFormFields(
    functions,
    typeof componentVal === 'string' ? [componentVal] : undefined,
    `entities.${index}.dependsOnComponents`,
    setValue,
  );

  useUpdateDependentFormFields(
    functions,
    typeof functionVal === 'string' ? [functionVal] : undefined,
    `entities.${index}.dependsOnFunctions`,
    setValue,
  );

  useUpdateDependentFormFields(
    functions,
    typeof functionVal === 'string' ? [functionVal] : undefined,
    `entities.${index}.childFunctions`,
    setValue,
  );

  useUpdateDependentFormFields(
    systems,
    typeof systemVal === 'string' ? [systemVal] : undefined,
    `entities.${index}.system`,
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
          entities={groups || []}
          required
        />
      </div>
      <Flex>
        <div style={{ flexGrow: 1, width: '50%' }}>
          <SingleSelectAutocomplete
            index={index}
            control={control}
            errors={errors}
            formname="functionForm"
            fieldname="entityType"
            freeSolo
            options={Object.values(FunctionTypes)}
            required
          />
        </div>
      </Flex>

      <div>
        <MultipleEntitiesAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="functionForm"
          fieldname="dependsOnComponents"
          entities={components || []}
        />
      </div>
      <div>
        <MultipleEntitiesAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="functionForm"
          fieldname="dependsOnSystems"
          entities={systems || []}
        />
      </div>
      <div>
        <MultipleEntitiesAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="functionForm"
          fieldname="dependsOnFunctions"
          entities={functions || []}
        />
      </div>
      <div>
        <MultipleEntitiesAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="functionForm"
          fieldname="childFunctions"
          entities={functions || []}
        />
      </div>
      <TagField index={index} control={control} errors={errors} options={[]} />
    </Flex>
  );
};

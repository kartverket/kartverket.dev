import { Flex } from '@backstage/ui';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';
import { EntityErrors, SystemTypes } from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { useUpdateDependentFormFields } from '../../../hooks/useUpdateDependentFormFields';
import { TagField } from '../Autocompletes/TagField';
import { SingleEntityAutocomplete } from '../Autocompletes/SingleEntityAutocomplete';
import { SingleSelectAutocomplete } from '../Autocompletes/SingleSelectAutocomplete';

export type SystemFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  setValue: UseFormSetValue<z.infer<typeof formSchema>>;
  errors: EntityErrors<'System'>;
  groups: {
    loading: boolean;
    error: Error | undefined;
    value: Entity[];
  };
  domains: {
    loading: boolean;
    error: Error | undefined;
    value: Entity[];
  };
};

export const SystemForm = ({
  index,
  control,
  setValue,
  errors,
  groups,
  domains,
}: SystemFormProps) => {
  const domainVal = useWatch({
    control,
    name: `entities.${index}.domain`,
  });

  useUpdateDependentFormFields(
    domains,
    domainVal ? [domainVal] : undefined,
    `entities.${index}.domain`,
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
        />
      </div>
      <Flex>
        <div style={{ flexGrow: 1, width: '50%' }}>
          <SingleSelectAutocomplete
            index={index}
            control={control}
            errors={errors}
            formname="systemForm"
            fieldname="entityType"
            freeSolo
            options={Object.values(SystemTypes)}
          />
        </div>
      </Flex>
      <div>
        <SingleEntityAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="systemForm"
          fieldname="domain"
          entities={domains.value || []}
        />
      </div>
      <TagField index={index} control={control} errors={errors} options={[]} />
    </Flex>
  );
};

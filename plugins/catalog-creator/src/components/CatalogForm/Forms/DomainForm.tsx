import { Flex } from '@backstage/ui';
import { Control } from 'react-hook-form';
import { DomainTypes, EntityErrors } from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';

import { Entity } from '@backstage/catalog-model';
import { TagField } from '../Autocompletes/TagField';
import { SingleEntityAutocomplete } from '../Autocompletes/SingleEntityAutocomplete';
import { SingleSelectAutocomplete } from '../Autocompletes/SingleSelectAutocomplete';
import { MultipleEntitiesAutocomplete } from '../Autocompletes/MultipleEntitiesAutocomplete';

export type DomainFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Domain'>;
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

export const DomainForm = ({
  index,
  control,
  errors,
  groups,
  domains,
}: DomainFormProps) => {
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
            formname="domainForm"
            fieldname="entityType"
            freeSolo
            options={Object.values(DomainTypes)}
          />
        </div>
      </Flex>
      <div>
        <MultipleEntitiesAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="domainForm"
          fieldname="subdomainOf"
          freeSolo
          entities={domains.value || []}
        />
      </div>
      <TagField index={index} control={control} errors={errors} options={[]} />
    </Flex>
  );
};

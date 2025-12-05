import { Flex } from '@backstage/ui';
import { Control } from 'react-hook-form';
import { DomainTypes, EntityErrors } from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';

import { Entity } from '@backstage/catalog-model';
import { TagField } from '../Autocompletes/TagField';
import { SingleEntityAutocomplete } from '../Autocompletes/SingleEntityAutocomplete';
import { SingleSelectAutocomplete } from '../Autocompletes/singleSelectAutocomplete';

export type DomainFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Resource'>;
  groups: Entity[];
};

export const DomainForm = ({
  index,
  control,
  errors,
  groups,
}: DomainFormProps) => {
  return (
    <Flex direction="column" justify="start">
      <div>
        <SingleEntityAutocomplete
          index={index}
          control={control}
          errors={errors}
          fieldname="owner"
          entities={groups || []}
        />
      </div>
      <Flex>
        <div style={{ flexGrow: 1, width: '50%' }}>
          <SingleSelectAutocomplete
            index={index}
            control={control}
            errors={errors}
            formname="componentForm"
            fieldname="entityType"
            freeSolo
            options={Object.values(DomainTypes)}
          />
        </div>
      </Flex>
      <TagField index={index} control={control} errors={errors} options={[]} />
    </Flex>
  );
};

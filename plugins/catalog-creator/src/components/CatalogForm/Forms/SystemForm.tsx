import { Flex } from '@backstage/ui';
import { Control } from 'react-hook-form';
import { EntityErrors, SystemTypes } from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { TagField } from '../Autocompletes/TagField';
import { SingleEntityAutocomplete } from '../Autocompletes/SingleEntityAutocomplete';
import { SingleSelectAutocomplete } from '../Autocompletes/singleSelectAutocomplete';

export type SystemFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'System'>;
  groups: Entity[];
};

export const SystemForm = ({
  index,
  control,
  errors,
  groups,
}: SystemFormProps) => {
  const catalogApi = useApi(catalogApiRef);

  const fetchDomains = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: {
        kind: 'Domain',
      },
    });
    return results.items as Entity[];
  }, [catalogApi]);

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
            formname="systemForm"
            fieldname="type"
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
          entities={fetchDomains.value || []}
        />
      </div>
      <TagField index={index} control={control} errors={errors} options={[]} />
    </Flex>
  );
};

import { Flex } from '@backstage/ui';
import { Control, Controller, FieldError, Merge } from 'react-hook-form';
import { EntityErrors, ResourceTypes } from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { FieldHeader } from '../FieldHeader';
import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import { useAsync } from 'react-use';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { TagField } from '../Autocompletes/TagField';
import { SingleEntityAutocomplete } from '../Autocompletes/SingleEntityAutocomplete';
import { SingleSelectAutocomplete } from '../Autocompletes/SingleSelectAutocomplete';

import style from '../../../catalog.module.css';

export type ResourceFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Resource'>;
  systems: Entity[];
  groups: Entity[];
};

export const ResourceForm = ({
  index,
  control,
  errors,
  systems,
  groups,
}: ResourceFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);
  const catalogApi = useApi(catalogApiRef);

  const errorText = (
    text:
      | FieldError
      | undefined
      | Merge<FieldError, (FieldError | undefined)[]>,
  ) => {
    return (
      <span className={`${style.errorText} ${text ? '' : style.hidden}`}>
        {text?.message ? t(text?.message as keyof typeof t) : '\u00A0'}
      </span>
    );
  };

  const formatEntityString = (entity: Entity): string => {
    return `${entity.kind.toLowerCase()}:${entity.metadata.namespace?.toLowerCase() ?? 'default'}/${entity.metadata.name}`;
  };

  const fetchComponentsAndResources = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: [{ kind: 'Component' }, { kind: 'Resource' }],
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
            formname="resourceForm"
            fieldname="entityType"
            freeSolo
            options={Object.values(ResourceTypes)}
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
          entities={systems || []}
        />
      </div>
      <div>
        <FieldHeader
          fieldName={t('form.resourceForm.dependencyof.fieldName')}
          tooltipText={t('form.resourceForm.dependencyof.tooltipText')}
        />
        <Controller
          name={`entities.${index}.dependencyof`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Autocomplete
              multiple
              value={
                (value || [])
                  .map(str => {
                    return (fetchComponentsAndResources.value || []).find(
                      entity => {
                        const entityStr = `${entity.kind.toLowerCase()}:${entity.metadata.namespace?.toLowerCase() ?? 'default'}/${entity.metadata.name}`;
                        return entityStr === str;
                      },
                    );
                  })
                  .filter(Boolean) as Entity[]
              }
              onBlur={onBlur}
              onChange={(_, newValue) => {
                const names = newValue.map(item => {
                  return formatEntityString(item);
                });
                onChange(names);
              }}
              options={fetchComponentsAndResources.value || []}
              getOptionLabel={option => {
                return `${option.metadata.title ?? option.metadata.name} (${option.kind.toLowerCase()})`;
              }}
              isOptionEqualToValue={(option, selectedValue) => {
                const optionName = formatEntityString(option);
                const valueName = formatEntityString(selectedValue);
                return optionName === valueName;
              }}
              size="small"
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: 10,
                  height: 1,
                  padding: 1,
                },
              }}
              renderInput={params => (
                <MuiTextField
                  {...params}
                  placeholder={t('form.resourceForm.dependencyof.placeholder')}
                  InputProps={{
                    ...params.InputProps,
                    className: style.textField,
                  }}
                />
              )}
            />
          )}
        />
        {errorText(errors?.dependencyof)}
      </div>
      <TagField index={index} control={control} errors={errors} options={[]} />
    </Flex>
  );
};

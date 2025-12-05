import { Flex } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';

import {
  AllowedLifecycleStages,
  ComponentTypes,
  EntityErrors,
  Kind,
} from '../../../types/types';
import { apiSchema, formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { FieldHeader } from '../FieldHeader';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import { TagField } from '../Autocompletes/TagField';
import { SingleSelectAutocomplete } from '../Autocompletes/singleSelectAutocomplete';
import { SingleEntityAutocomplete } from '../Autocompletes/SingleEntityAutocomplete';
import { MultipleEntitiesAutocomplete } from '../Autocompletes/MultipleEntitiesAutocomplete';

export type ComponentFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Component'>;
  appendHandler: (entityKindToAdd: Kind, name?: string) => void;
  systems: Entity[];
  groups: Entity[];
};

export const ComponentForm = ({
  index,
  control,
  errors,
  appendHandler,
  systems,
  groups,
}: ComponentFormProps) => {
  const catalogApi = useApi(catalogApiRef);
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  const formatEntityString = (entity: Entity): string => {
    return `${entity.kind.toLowerCase()}:${entity.metadata.namespace?.toLowerCase() ?? 'default'}/${entity.metadata.name}`;
  };

  const fetchAPIs = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: {
        kind: 'API',
      },
    });
    return results.items as Entity[];
  }, [catalogApi]);

  const fetchComponentsAndResources = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: [{ kind: ['Component', 'Resource'] }],
    });

    return results.items as Entity[];
  }, [catalogApi]);

  const filter = createFilterOptions<Entity | string>();

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
        <div style={{ width: '50%' }}>
          <SingleSelectAutocomplete
            index={index}
            control={control}
            errors={errors}
            formname="componentForm"
            fieldname="lifecycle"
            options={Object.values(AllowedLifecycleStages)}
          />
        </div>

        <div style={{ flexGrow: 1, width: '50%' }}>
          <SingleSelectAutocomplete
            index={index}
            control={control}
            errors={errors}
            formname="componentForm"
            fieldname="entityType"
            freeSolo
            options={Object.values(ComponentTypes)}
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
          fieldName={t('form.componentForm.providesApis.fieldName')}
          tooltipText={t('form.componentForm.providesApis.tooltipText')}
        />
        <Controller
          name={`entities.${index}.providesApis`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Autocomplete
              multiple
              freeSolo
              value={value || []}
              onBlur={onBlur}
              onChange={(_, newValue) => {
                const names = newValue.map(item => {
                  if (typeof item === 'string') {
                    if (
                      !fetchAPIs.value?.some(
                        api => api.metadata.name === item,
                      ) &&
                      !value?.some(oldInput => oldInput === item)
                    ) {
                      const result = apiSchema
                        .pick({ name: true })
                        .safeParse({ name: item });
                      if (result.success) {
                        appendHandler('API', item);
                      }
                    }
                    return item;
                  }
                  return item.metadata.name;
                });
                onChange(names);
              }}
              options={(fetchAPIs.value || []) as (Entity | string)[]}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue: filterInput } = params;
                const isExisting = options.some(
                  option =>
                    filterInput ===
                    (typeof option === 'string'
                      ? option
                      : option.metadata.name),
                );

                if (filterInput !== '' && !isExisting) {
                  filtered.push(filterInput);
                }

                return filtered;
              }}
              getOptionLabel={option => {
                if (typeof option === 'string') return option;
                return option.metadata.title ?? option.metadata.name;
              }}
              isOptionEqualToValue={(option, selectedValue) => {
                const optionName =
                  typeof option === 'string' ? option : option.metadata.name;
                const valueName =
                  typeof selectedValue === 'string'
                    ? selectedValue
                    : selectedValue.metadata?.name;
                return optionName === valueName;
              }}
              size="small"
              renderInput={params => (
                <MuiTextField
                  {...params}
                  placeholder={t('form.componentForm.providesApis.placeholder')}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      fontSize: '0.85rem',
                      font: 'system-ui',
                    },
                  }}
                />
              )}
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.providesApis ? 'visible' : 'hidden',
          }}
        >
          {errors?.providesApis?.message
            ? t(errors?.providesApis?.message as keyof typeof t)
            : '\u00A0'}
        </span>
      </div>
      <div>
        <MultipleEntitiesAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="componentForm"
          fieldname="consumesApis"
          entities={fetchAPIs.value || []}
          freeSolo
        />
      </div>
      <div>
        <FieldHeader
          fieldName={t('form.componentForm.dependsOn.fieldName')}
          tooltipText={t('form.componentForm.dependsOn.tooltipText')}
        />
        <Controller
          name={`entities.${index}.dependsOn`}
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
                  placeholder={t('form.componentForm.dependsOn.placeholder')}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      fontSize: '0.85rem',
                      font: 'system-ui',
                    },
                  }}
                />
              )}
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.dependsOn ? 'visible' : 'hidden',
          }}
        >
          {errors?.dependsOn?.message
            ? t(errors?.dependsOn?.message as keyof typeof t)
            : '\u00A0'}
        </span>
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

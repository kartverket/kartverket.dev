import { Flex } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';
import { ApiTypes, EntityErrors } from '../../../types/types';
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

export type ResourceFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Resource'>;
  systems: Entity[];
};

export const ResourceForm = ({
  index,
  control,
  errors,
  systems,
}: ResourceFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);
  const catalogApi = useApi(catalogApiRef);

  const fetchComponentsAndResources = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: [{ kind: 'Component' }, { kind: 'Resources' }],
    });
    return results.items as Entity[];
  }, [catalogApi]);

  return (
    <Flex direction="column" justify="start">
      <Flex>
        <div style={{ flexGrow: 1, width: '50%' }}>
          <FieldHeader
            fieldName={t('form.APIForm.type.fieldName')}
            tooltipText={t('form.APIForm.type.tooltipText')}
            required
          />
          <Controller
            name={`entities.${index}.entityType`}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Autocomplete
                value={value}
                onChange={(_, newValue) => {
                  onChange(newValue ?? '');
                }}
                onBlur={onBlur}
                options={Object.values(ApiTypes)}
                getOptionLabel={option => option}
                size="small"
                renderInput={params => (
                  <MuiTextField
                    {...params}
                    placeholder={t('form.APIForm.type.placeholder')}
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
              visibility: errors?.entityType ? 'visible' : 'hidden',
            }}
          >
            {errors?.entityType?.message
              ? t(errors?.entityType?.message as keyof typeof t)
              : '\u00A0'}
          </span>
        </div>
      </Flex>
      <div>
        <FieldHeader
          fieldName={t('form.resourceForm.system.fieldName')}
          tooltipText={t('form.resourceForm.system.tooltipText')}
        />
        <Controller
          name={`entities.${index}.system`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Autocomplete
              value={
                value
                  ? (systems.find(entity => entity.metadata.name === value) ??
                    null)
                  : null
              }
              onBlur={onBlur}
              onChange={(_, newValue) => {
                const names = newValue?.metadata?.name ?? '';
                onChange(names);
              }}
              options={systems || []}
              getOptionLabel={option => {
                return option.metadata.name;
              }}
              filterOptions={(options, state) => {
                const inputValue = state.inputValue.toLowerCase();
                return options.filter(option => {
                  const name = option.metadata.name.toLowerCase();
                  const title = (option.metadata.title ?? '').toLowerCase();
                  return (
                    name.includes(inputValue) || title.includes(inputValue)
                  );
                });
              }}
              renderOption={(props, option) => {
                const label = option.metadata.title ?? option.metadata.name;
                return <li {...props}>{label}</li>;
              }}
              isOptionEqualToValue={(option, selectedValue) => {
                return option.metadata.name === selectedValue.metadata.name;
              }}
              size="small"
              renderInput={params => (
                <MuiTextField
                  {...params}
                  placeholder={t('form.resourceForm.type.placeholder')}
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
            visibility: errors?.system ? 'visible' : 'hidden',
          }}
        >
          {errors?.system?.message
            ? t(errors?.system?.message as keyof typeof t)
            : '\u00A0'}
        </span>
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
              freeSolo
              value={value || []}
              onBlur={onBlur}
              onChange={(_, newValue) => {
                const names = newValue.map(item =>
                  typeof item === 'string' ? item : item.metadata.name,
                );
                onChange(names);
              }}
              options={fetchComponentsAndResources.value || []}
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
            visibility: errors?.depencencyOf ? 'visible' : 'hidden',
          }}
        >
          {errors?.depencencyOf?.message
            ? t(errors?.depencencyOf?.message as keyof typeof t)
            : '\u00A0'}
        </span>
      </div>
    </Flex>
  );
};

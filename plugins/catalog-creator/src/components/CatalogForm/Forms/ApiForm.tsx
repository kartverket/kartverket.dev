import { Flex } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';
import {
  AllowedLifecycleStages,
  ApiTypes,
  EntityErrors,
} from '../../../model/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { FieldHeader } from '../FieldHeader';
import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';

export type ApiFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'API'>;
  systems: Entity[];
};

export const ApiForm = ({ index, control, errors, systems }: ApiFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);
  return (
    <Flex direction="column" justify="start">
      <Flex>
        <div style={{ width: '50%' }}>
          <FieldHeader
            fieldName={t('form.APIForm.lifecycle.fieldName')}
            tooltipText={t('form.APIForm.lifecycle.tooltipText')}
            required
          />
          <Controller
            name={`entities.${index}.lifecycle`}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Autocomplete
                value={value}
                onChange={(_, newValue) => {
                  onChange(newValue ?? '');
                }}
                onBlur={onBlur}
                options={Object.values(AllowedLifecycleStages)}
                getOptionLabel={option => option}
                size="small"
                renderInput={params => (
                  <MuiTextField
                    {...params}
                    placeholder={t('form.APIForm.lifecycle.placeholder')}
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
              visibility: errors?.lifecycle ? 'visible' : 'hidden',
            }}
          >
            {errors?.lifecycle?.message || '\u00A0'}
          </span>
        </div>

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
            {errors?.entityType?.message || '\u00A0'}
          </span>
        </div>
      </Flex>

      <div>
        <FieldHeader
          fieldName={t('form.APIForm.system.fieldName')}
          tooltipText={t('form.APIForm.type.tooltipText')}
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
            visibility: errors?.system ? 'visible' : 'hidden',
          }}
        >
          {errors?.system?.message || '\u00A0'}
        </span>
      </div>
      <div>
        <FieldHeader
          fieldName={t('form.APIForm.definition.fieldName')}
          tooltipText={t('form.APIForm.definition.tooltipText')}
        />
        <Controller
          name={`entities.${index}.definition`}
          control={control}
          render={({ field }) => (
            <MuiTextField
              {...field}
              name="Definition"
              fullWidth
              size="small"
              inputProps={{
                style: {
                  fontSize: '0.85rem',
                  fontFamily: 'system-ui',
                },
              }}
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.definition ? 'visible' : 'hidden',
          }}
        >
          {errors?.definition?.message || '\u00A0'}
        </span>
      </div>
    </Flex>
  );
};

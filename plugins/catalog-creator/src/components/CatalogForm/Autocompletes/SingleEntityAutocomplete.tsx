import { Control, Controller } from 'react-hook-form';
import { FieldHeader } from '../FieldHeader';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { EntityErrors, Kind } from '../../../types/types';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import { Entity } from '@backstage/catalog-model';

type SingleEntityAutocompleteProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<Kind>;

  freeSolo?: boolean;
  entities: Entity[];
  formname?:
    | 'componentForm'
    | 'APIForm'
    | 'systemForm'
    | 'resourceForm'
    | 'domainForm';
  fieldname:
    | 'tags'
    | 'owner'
    | 'lifecycle'
    | 'entityType'
    | 'system'
    | 'domain'
    | 'dependencyof';
};

export const SingleEntityAutocomplete = ({
  index,
  control,
  errors,
  entities,
  freeSolo,
  formname,
  fieldname,
}: SingleEntityAutocompleteProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  const getTranslationKey = (
    suffix: 'fieldName' | 'tooltipText' | 'placeholder',
  ) => {
    if (formname) {
      return `form.${formname}.${fieldname}.${suffix}` as any;
    }
    return `form.${fieldname}.${suffix}` as any;
  };

  const fieldNameText = t(getTranslationKey('fieldName'), {});
  const tooltipText = t(getTranslationKey('tooltipText'), {});
  const placeholder = t(getTranslationKey('placeholder'), {});

  const filter = createFilterOptions<Entity | string>();

  return (
    <>
      <FieldHeader fieldName={fieldNameText} tooltipText={tooltipText} />
      <Controller
        name={`entities.${index}.${fieldname}` as any}
        control={control}
        render={({ field: { value, onChange, onBlur } }) => (
          <div>
            <Autocomplete
              freeSolo={freeSolo}
              value={
                value
                  ? (entities.find(entity => entity.metadata.name === value) ??
                    value)
                  : null
              }
              onBlur={onBlur}
              onChange={(_, newValue) => {
                const names =
                  typeof newValue === 'string'
                    ? newValue
                    : (newValue?.metadata?.name ?? '');
                onChange(names);
              }}
              onInputChange={(_, newInputValue) => {
                if (freeSolo) {
                  onChange(newInputValue);
                }
              }}
              options={entities || []}
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

                if (filterInput !== '' && !isExisting && freeSolo) {
                  filtered.push(filterInput);
                }

                return filtered;
              }}
              getOptionLabel={option => {
                return typeof option === 'string'
                  ? option
                  : option.metadata.name;
              }}
              renderOption={(optionprops, option) => {
                const label =
                  typeof option === 'string'
                    ? option
                    : (option.metadata.title ?? option.metadata.name);
                return <li {...optionprops}>{label}</li>;
              }}
              isOptionEqualToValue={(option, selectedValue) => {
                if (
                  typeof option === 'string' &&
                  typeof selectedValue === 'string'
                ) {
                  return option === selectedValue;
                }
                if (
                  typeof option !== 'string' &&
                  typeof selectedValue !== 'string'
                ) {
                  return option.metadata.name === selectedValue.metadata.name;
                }
                return false;
              }}
              size="small"
              renderInput={params => (
                <MuiTextField
                  {...params}
                  placeholder={placeholder}
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
          </div>
        )}
      />

      <span
        style={{
          color: 'red',
          fontSize: '0.75rem',
          visibility: (errors as any)?.[fieldname] ? 'visible' : 'hidden',
        }}
      >
        {(errors as any)?.[fieldname]?.message
          ? t((errors as any)[fieldname]?.message as any, {})
          : '\u00A0'}
      </span>
    </>
  );
};

import { Control, Controller } from 'react-hook-form';
import { FieldHeader } from '../FieldHeader';
import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { EntityErrors, Kind } from '../../../types/types';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import { useState } from 'react';
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
    | 'type'
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
  const [inputValue, setInputValue] = useState<string>('');

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

  const options: (Entity | string)[] = (() => {
    if (freeSolo && inputValue) {
      const matchesEntity = entities.some(
        entity => entity.metadata.name === inputValue,
      );
      return matchesEntity ? entities : [...entities, inputValue];
    }
    return entities;
  })();

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
                setInputValue(newInputValue);
                if (freeSolo) {
                  onChange(newInputValue);
                }
              }}
              options={options || []}
              getOptionLabel={option => {
                return typeof option === 'string'
                  ? option
                  : option.metadata.name;
              }}
              filterOptions={(optionList, state) => {
                const inputVal = state.inputValue.toLowerCase();
                return optionList.filter(option => {
                  if (typeof option === 'string') {
                    return option.toLowerCase().includes(inputVal);
                  }
                  const name = option.metadata.name.toLowerCase();
                  const title = (option.metadata.title ?? '').toLowerCase();
                  return name.includes(inputVal) || title.includes(inputVal);
                });
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

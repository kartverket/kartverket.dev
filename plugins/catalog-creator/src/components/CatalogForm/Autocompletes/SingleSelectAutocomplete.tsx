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

type SingleSelectAutocompleteProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<Kind>;
  options: string[];
  freeSolo?: boolean;
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

export const SingleSelectAutocomplete = ({
  index,
  control,
  errors,
  options,
  freeSolo,
  formname,
  fieldname,
}: SingleSelectAutocompleteProps) => {
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

  const optionsWithInput =
    freeSolo && inputValue && !options.includes(inputValue)
      ? [...options, inputValue]
      : options;

  return (
    <>
      <FieldHeader fieldName={fieldNameText} tooltipText={tooltipText} />
      <Controller
        name={`entities.${index}.${fieldname}` as any}
        control={control}
        render={({ field: { value, onChange, onBlur } }) => (
          <div>
            <Autocomplete
              value={value ? (options.find(x => x === value) ?? null) : null}
              onChange={(_, newValue) => {
                onChange(newValue ?? '');
              }}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
                onChange(newInputValue);
              }}
              onBlur={onBlur}
              freeSolo={freeSolo}
              options={optionsWithInput}
              getOptionLabel={option => option}
              size="small"
              renderInput={params => (
                <MuiTextField
                  {...params}
                  placeholder={placeholder}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      fontSize: '0.85rem',
                      fontFamily: 'system-ui',
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

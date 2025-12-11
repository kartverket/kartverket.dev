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

import style from '../../../catalog.module.css';

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
  fieldname: 'lifecycle' | 'entityType';
  required?: boolean;
};

type TranslationKeyWithFormName =
  `form.${NonNullable<SingleSelectAutocompleteProps['formname']>}.${SingleSelectAutocompleteProps['fieldname']}.${'fieldName' | 'tooltipText' | 'placeholder'}`;

type TranslationKeyWithoutFormName =
  `form.${SingleSelectAutocompleteProps['fieldname']}.${'fieldName' | 'tooltipText' | 'placeholder'}`;

type TranslationKey =
  | TranslationKeyWithFormName
  | TranslationKeyWithoutFormName;

const hasFieldError = (
  errors: EntityErrors<Kind> | undefined,
  field: SingleSelectAutocompleteProps['fieldname'],
): errors is EntityErrors<Kind> & Record<typeof field, { message: string }> => {
  return !!errors && field in errors && !!errors[field as keyof typeof errors];
};

export const SingleSelectAutocomplete = ({
  index,
  control,
  errors,
  options,
  freeSolo,
  formname,
  fieldname,
  required,
}: SingleSelectAutocompleteProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);
  const [inputValue, setInputValue] = useState<string>('');

  const getTranslationKey = (
    suffix: 'fieldName' | 'tooltipText' | 'placeholder',
  ): TranslationKey => {
    if (formname) {
      return `form.${formname}.${fieldname}.${suffix}`;
    }
    return `form.${fieldname}.${suffix}`;
  };
  const translateField = (key: TranslationKey) => {
    return t(key as Parameters<typeof t>[0], {});
  };

  const fieldNameText = translateField(getTranslationKey('fieldName'));
  const tooltipText = translateField(getTranslationKey('tooltipText'));
  const placeholder = translateField(getTranslationKey('placeholder'));

  const optionsWithInput =
    freeSolo && inputValue && !options.includes(inputValue)
      ? [...options, inputValue]
      : options;

  return (
    <>
      <FieldHeader
        fieldName={fieldNameText}
        tooltipText={tooltipText}
        required={required}
      />
      <Controller
        name={`entities.${index}.${fieldname}`}
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
        className={`${style.errorText} ${hasFieldError(errors, fieldname) ? '' : style.hidden}`}
      >
        {hasFieldError(errors, fieldname) && errors[fieldname]?.message
          ? translateField(errors[fieldname].message as TranslationKey)
          : '\u00A0'}
      </span>
    </>
  );
};

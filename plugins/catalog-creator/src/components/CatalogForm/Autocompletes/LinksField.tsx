import { Control, Controller } from 'react-hook-form';
import { FieldHeader } from '../FieldHeader';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { EntityErrors, Kind } from '../../../types/types';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import { useState } from 'react';

import style from '../../../catalog.module.css';

type LinksFieldProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<Kind>;
  options: string[];
  formname?:
    | 'componentForm'
    | 'APIForm'
    | 'systemForm'
    | 'resourceForm'
    | 'domainForm'
    | 'functionForm';
  required?: boolean;
};

type TranslationKeyWithFormName =
  `form.${NonNullable<LinksFieldProps['formname']>}.links.${'fieldName' | 'tooltipText' | 'placeholder'}`;

type TranslationKeyWithoutFormName =
  `form.links.${'fieldName' | 'tooltipText' | 'placeholder'}`;

type TranslationKey =
  | TranslationKeyWithFormName
  | TranslationKeyWithoutFormName;

const hasFieldError = (
  errors: EntityErrors<Kind> | undefined,
  field: 'links',
): errors is EntityErrors<Kind> & Record<typeof field, { message: string }> => {
  return !!errors && field in errors && !!errors[field as keyof typeof errors];
};

export const LinksField = ({
  index,
  control,
  errors,
  options,
  formname,
}: LinksFieldProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);
  const [inputValue, setInputValue] = useState<string>('');

  const getTranslationKey = (
    suffix: 'fieldName' | 'tooltipText' | 'placeholder',
  ): TranslationKey => {
    if (formname) {
      return `form.${formname}.links.${suffix}`;
    }
    return `form.links.${suffix}`;
  };
  const translateField = (key: TranslationKey) => {
    return t(key as Parameters<typeof t>[0], {});
  };

  const fieldNameText = translateField(getTranslationKey('fieldName'));
  const tooltipText = translateField(getTranslationKey('tooltipText'));
  const placeholder = translateField(getTranslationKey('placeholder'));

  return (
    <div>
      <FieldHeader fieldName={fieldNameText} tooltipText={tooltipText} />
      <Controller
        name={`entities.${index}.links`}
        control={control}
        render={({ field }) => (
          <div>
            <Autocomplete
              {...field}
              onChange={(_, value) => {
                const transformedValue = value.map(item => ({
                  url: item,
                  title: item,
                }));
                field.onChange(transformedValue);
              }}
              inputValue={inputValue}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
              }}
              value={
                field.value
                  ? field.value.map(
                      (link: { url: string; title: string }) => link.url,
                    )
                  : []
              }
              multiple
              freeSolo
              options={
                inputValue && !options.includes(inputValue)
                  ? [...options, inputValue]
                  : options
              }
              size="small"
              getOptionLabel={(
                option: string | { url: string; title: string },
              ) => {
                if (typeof option === 'string') return option;
                return option.url || '';
              }}
              isOptionEqualToValue={(option, value) => {
                if (typeof option === 'string' && typeof value === 'string') {
                  return option === value;
                }
                return option === value;
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={placeholder}
                  InputProps={{
                    ...params.InputProps,
                    className: style.textField,
                  }}
                />
              )}
            />
          </div>
        )}
      />

      <span
        className={`${style.errorText} ${hasFieldError(errors, 'links') ? '' : style.hidden}`}
      >
        {hasFieldError(errors, 'links') && errors.links?.message
          ? translateField(errors.links.message as TranslationKey)
          : '\u00A0'}
      </span>
    </div>
  );
};

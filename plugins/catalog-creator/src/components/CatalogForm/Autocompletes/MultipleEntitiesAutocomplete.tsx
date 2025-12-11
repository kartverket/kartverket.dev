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
import style from '../../../catalog.module.css';

type MultipleEntitiesAutocompleteProps = {
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
  fieldname: 'dependencyof' | 'consumesApis';
  required?: boolean;
};

type TranslationKeyWithFormName =
  `form.${NonNullable<MultipleEntitiesAutocompleteProps['formname']>}.${MultipleEntitiesAutocompleteProps['fieldname']}.${'fieldName' | 'tooltipText' | 'placeholder'}`;

type TranslationKeyWithoutFormName =
  `form.${MultipleEntitiesAutocompleteProps['fieldname']}.${'fieldName' | 'tooltipText' | 'placeholder'}`;

type TranslationKey =
  | TranslationKeyWithFormName
  | TranslationKeyWithoutFormName;

const hasFieldError = (
  errors: EntityErrors<Kind> | undefined,
  field: MultipleEntitiesAutocompleteProps['fieldname'],
): errors is EntityErrors<Kind> & Record<typeof field, { message: string }> => {
  return !!errors && field in errors && !!errors[field as keyof typeof errors];
};

export const MultipleEntitiesAutocomplete = ({
  index,
  control,
  errors,
  entities,
  freeSolo,
  formname,
  fieldname,
  required,
}: MultipleEntitiesAutocompleteProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

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

  const filter = createFilterOptions<Entity | string>();

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
              multiple
              freeSolo={freeSolo}
              value={
                value && Array.isArray(value)
                  ? value.map(
                      name =>
                        entities.find(
                          entity => entity.metadata.name === name,
                        ) ?? name,
                    )
                  : []
              }
              onBlur={onBlur}
              onChange={(_, newValue) => {
                const names = newValue.map(item =>
                  typeof item === 'string' ? item.trim() : item.metadata.name,
                );
                onChange(names);
              }}
              options={entities}
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
        className={`${style.errorText} ${hasFieldError(errors, fieldname) ? '' : style.hidden}`}
      >
        {hasFieldError(errors, fieldname) && errors[fieldname]?.message
          ? translateField(errors[fieldname].message as TranslationKey)
          : '\u00A0'}
      </span>
    </>
  );
};

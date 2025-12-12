import { Control, Controller } from 'react-hook-form';
import { FieldHeader } from '../FieldHeader';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { EntityErrors, Kind, Kinds } from '../../../types/types';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import { Entity } from '@backstage/catalog-model';
import style from '../../../catalog.module.css';

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
  fieldname: 'owner' | 'system' | 'domain';
  required?: boolean;
  kind?: Kind;
};

type TranslationKeyWithFormName =
  `form.${NonNullable<SingleEntityAutocompleteProps['formname']>}.${SingleEntityAutocompleteProps['fieldname']}.${'fieldName' | 'tooltipText' | 'placeholder'}`;

type TranslationKeyWithoutFormName =
  `form.${SingleEntityAutocompleteProps['fieldname']}.${'fieldName' | 'tooltipText' | 'placeholder'}`;

type TranslationKey =
  | TranslationKeyWithFormName
  | TranslationKeyWithoutFormName;

const hasFieldError = (
  errors: EntityErrors<Kind> | undefined,
  field: SingleEntityAutocompleteProps['fieldname'],
): errors is EntityErrors<Kind> & Record<typeof field, { message: string }> => {
  return !!errors && field in errors && !!errors[field as keyof typeof errors];
};

export const SingleEntityAutocomplete = ({
  index,
  control,
  errors,
  entities,
  freeSolo,
  formname,
  fieldname,
  required,
  kind = Kinds.Component,
}: SingleEntityAutocompleteProps) => {
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

  const filter = createFilterOptions<Entity>();

  const formatEntityString = (entity: Entity): string => {
    return `${entity.kind.toLowerCase()}:${entity.metadata.namespace?.toLowerCase() ?? 'default'}/${entity.metadata.name}`;
  };

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
              freeSolo={freeSolo}
              value={
                value
                  ? (entities.find(
                      entity => formatEntityString(entity) === value,
                    ) ?? value)
                  : null
              }
              onBlur={onBlur}
              onChange={(_, newValue) => {
                if (typeof newValue === 'string') {
                  onChange(`${kind}:default/${newValue}`);
                } else if (newValue) {
                  onChange(formatEntityString(newValue));
                }
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
                  const newEntity = {
                    metadata: {
                      name: filterInput,
                    },
                  } as Entity;
                  filtered.push(newEntity);
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
        className={`${style.errorText} ${hasFieldError(errors, fieldname) ? '' : style.hidden}`}
      >
        {hasFieldError(errors, fieldname) && errors[fieldname]?.message
          ? translateField(errors[fieldname].message as TranslationKey)
          : '\u00A0'}
      </span>
    </>
  );
};

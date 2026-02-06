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
    | 'domainForm'
    | 'functionForm';
  fieldname:
    | 'dependencyOf'
    | 'consumesApis'
    | 'subdomainOf'
    | 'providesApis'
    | 'dependsOn'
    | 'dependsOnComponents'
    | 'dependsOnFunctions'
    | 'dependsOnSystems';

  required?: boolean;
  kind?: Kind;
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
  kind = Kinds.Component,
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

  const formatEntityString = (entity: Entity): string => {
    return `${entity.kind.toLowerCase()}:${entity.metadata.namespace?.toLowerCase() ?? 'default'}/${entity.metadata.name}`;
  };

  const fieldNameText = translateField(getTranslationKey('fieldName'));
  const tooltipText = translateField(getTranslationKey('tooltipText'));
  const placeholder = translateField(getTranslationKey('placeholder'));

  const filter = createFilterOptions<Entity>();

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
                (value || [])
                  .map(str => {
                    return (entities || []).find(entity => {
                      const entityStr = `${entity.kind.toLowerCase()}:${entity.metadata.namespace?.toLowerCase() ?? 'default'}/${entity.metadata.name}`;
                      return entityStr === str;
                    });
                  })
                  .filter(Boolean) as Entity[]
              }
              onBlur={onBlur}
              onChange={(_, newValue) => {
                const names = newValue.map(item => {
                  if (typeof item === 'string') {
                    return `${kind}:default/${item}`;
                  }
                  return formatEntityString(item);
                });
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
                  const newEntity = {
                    kind: kind,
                    metadata: {
                      name: filterInput,
                    },
                  } as Entity;
                  filtered.push(newEntity);
                }
                return filtered;
              }}
              getOptionLabel={option => {
                if (typeof option === 'string') return option;
                if (fieldname === 'dependencyOf' || fieldname === 'dependsOn')
                  return `${option.metadata.title ?? option.metadata.name} (${option.kind.toLowerCase()})`;
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

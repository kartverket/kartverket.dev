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
  fieldname:
    | 'tags'
    | 'owner'
    | 'lifecycle'
    | 'type'
    | 'system'
    | 'domain'
    | 'dependencyof'
    | 'consumesAPIs';
};

export const MultipleEntitiesAutocomplete = ({
  index,
  control,
  errors,
  entities,
  freeSolo,
  formname,
  fieldname,
}: MultipleEntitiesAutocompleteProps) => {
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
                  typeof item === 'string' ? item : item.metadata.name,
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

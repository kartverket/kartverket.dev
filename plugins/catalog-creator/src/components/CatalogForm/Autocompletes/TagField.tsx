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

type TagFieldProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<Kind>;
  options: string[];
};

export const TagField = ({
  index,
  control,
  errors,
  options,
}: TagFieldProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);
  const [inputValue, setInputValue] = useState<string>('');
  return (
    <div>
      <FieldHeader
        fieldName={t('form.tags.fieldName')}
        tooltipText={t('form.tags.tooltipText')}
      />
      <Controller
        name={`entities.${index}.tags`}
        control={control}
        render={({ field }) => (
          <div>
            <Autocomplete
              {...field}
              onChange={(_, value) => field.onChange(value)}
              inputValue={inputValue}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
              }}
              value={field.value || []}
              multiple
              freeSolo
              options={
                inputValue && !options.includes(inputValue)
                  ? [...options, inputValue]
                  : options
              }
              size="small"
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={t('form.tags.placeholder')}
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
          visibility: errors?.tags ? 'visible' : 'hidden',
        }}
      >
        {errors?.tags?.message
          ? t(errors?.tags?.message as keyof typeof t)
          : '\u00A0'}
      </span>
    </div>
  );
};

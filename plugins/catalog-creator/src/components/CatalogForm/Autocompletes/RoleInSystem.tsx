import { Control, Controller } from 'react-hook-form';
import { FieldHeader } from '../FieldHeader';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { EntityErrors } from '../../../types/types';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import { useState } from 'react';
import { toLowerUnderscore } from '../../../utils/toLowerUnderscore';

import style from '../../../catalog.module.css';

type RoleInSystemProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Component'>;
  options: string[];
};

export const RoleInSystem = ({
  index,
  control,
  errors,
  options,
}: RoleInSystemProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);
  const [inputValue, setInputValue] = useState<string>('');
  const roleError = errors?.roleInSystem?.message;
  return (
    <div>
      <FieldHeader
        fieldName={t('form.componentForm.roleInSystem.fieldName')}
        tooltipText={t('form.componentForm.roleInSystem.tooltipText')}
      />
      <Controller
        name={`entities.${index}.roleInSystem`}
        control={control}
        render={({ field }) => (
          <div>
            <Autocomplete
              {...field}
              onChange={(_, value) => {
                field.onChange([...new Set(value.map(toLowerUnderscore))]);
                field.onBlur();
              }}
              onBlur={() => {
                if (inputValue !== '') {
                  const role = toLowerUnderscore(inputValue);
                  const currentRoles = field.value ?? [];

                  if (
                    !currentRoles.some(
                      existing => toLowerUnderscore(existing) === role,
                    )
                  ) {
                    field.onChange([...currentRoles, role]);
                  }
                  setInputValue('');
                }

                field.onBlur();
              }}
              inputValue={inputValue}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
              }}
              value={field.value || []}
              multiple
              freeSolo
              filterSelectedOptions
              options={options}
              size="small"
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={t('form.componentForm.roleInSystem.placeholder')}
                  InputProps={{
                    ...params.InputProps,
                    className: `${params.InputProps.className ?? ''} ${style.textField}`,
                  }}
                />
              )}
            />
          </div>
        )}
      />

      <span className={`${style.errorText} ${roleError ? '' : style.hidden}`}>
        {roleError ? t(roleError as Parameters<typeof t>[0]) : '\u00A0'}
      </span>
    </div>
  );
};

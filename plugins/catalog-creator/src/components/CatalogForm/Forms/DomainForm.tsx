import { Flex } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';
import { DomainTypes, EntityErrors } from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { FieldHeader } from '../FieldHeader';
import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';

export type DomainFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Resource'>;
};

export const DomainForm = ({ index, control, errors }: DomainFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  return (
    <Flex direction="column" justify="start">
      <Flex>
        <div style={{ flexGrow: 1, width: '50%' }}>
          <FieldHeader
            fieldName={t('form.domainForm.type.fieldname')}
            tooltipText={t('form.domainForm.type.tooltipText')}
            required
          />
          <Controller
            name={`entities.${index}.entityType`}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Autocomplete
                value={value}
                onChange={(_, newValue) => {
                  onChange(newValue ?? '');
                }}
                onBlur={onBlur}
                options={Object.values(DomainTypes)}
                getOptionLabel={option => option}
                size="small"
                renderInput={params => (
                  <MuiTextField
                    {...params}
                    placeholder={t('form.domainForm.type.placeholder')}
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
            )}
          />

          <span
            style={{
              color: 'red',
              fontSize: '0.75rem',
              visibility: errors?.entityType ? 'visible' : 'hidden',
            }}
          >
            {errors?.entityType?.message
              ? t(errors?.entityType?.message as keyof typeof t)
              : '\u00A0'}
          </span>
        </div>
      </Flex>
    </Flex>
  );
};

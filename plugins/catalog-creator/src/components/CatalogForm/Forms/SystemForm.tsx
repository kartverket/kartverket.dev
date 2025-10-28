import { Flex } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';
import { EntityErrors, SystemTypes } from '../../../model/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import CatalogSearch from '../../CatalogSearch';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { FieldHeader } from '../FieldHeader';
import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';

export type SystemFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'System'>;
  owners: Entity[];
};

export const SystemForm = ({ index, control, errors }: SystemFormProps) => {
  const catalogApi = useApi(catalogApiRef);
  const { t } = useTranslationRef(catalogCreatorTranslationRef);
  const fetchDomains = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: {
        kind: 'Domain',
      },
    });
    return results.items as Entity[];
  }, [catalogApi]);

  return (
    <Flex direction="column" justify="start">
      <Flex>
        <div style={{ flexGrow: 1, width: '50%' }}>
          <FieldHeader
            fieldName={t('form.systemForm.type.fieldName')}
            tooltipText={t('form.systemForm.type.tooltipText')}
          />
          <Controller
            name={`entities.${index}.systemType`}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Autocomplete
                value={value}
                onChange={(_, newValue) => {
                  onChange(newValue ?? '');
                }}
                onBlur={onBlur}
                options={Object.values(SystemTypes)}
                getOptionLabel={option => option}
                size="small"
                renderInput={params => (
                  <MuiTextField
                    {...params}
                    placeholder={t('form.componentForm.type.placeholder')}
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
      <div>
        <FieldHeader
          fieldName={t('form.systemForm.domain.fieldName')}
          tooltipText={t('form.systemForm.domain.tooltipText')}
        />
        <Controller
          name={`entities.${index}.domain`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <CatalogSearch
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              entityList={fetchDomains.value || []}
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.domain ? 'visible' : 'hidden',
          }}
        >
          {errors?.domain?.message
            ? t(errors?.domain?.message as keyof typeof t)
            : '\u00A0'}
        </span>
      </div>
    </Flex>
  );
};

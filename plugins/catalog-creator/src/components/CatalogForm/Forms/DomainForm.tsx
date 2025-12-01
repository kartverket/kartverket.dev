import { Flex } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';
import { DomainTypes, EntityErrors } from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { FieldHeader } from '../FieldHeader';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import { AutocompleteField } from '../AutocompleteField';
import { Entity } from '@backstage/catalog-model';
import { TagField } from '../TagField';
import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';

export type DomainFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Domain'>;
  groups: Entity[];
  domains: Entity[];
};

export const DomainForm = ({
  index,
  control,
  errors,
  groups,
  domains,
}: DomainFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  const formatEntityString = (entity: Entity): string => {
    return `${entity.kind.toLowerCase()}:${entity.metadata.namespace?.toLowerCase() ?? 'default'}/${entity.metadata.name}`;
  };

  return (
    <Flex direction="column" justify="start">
      <div>
        <FieldHeader
          fieldName={t('form.owner.fieldName')}
          tooltipText={t('form.name.tooltipText')}
          required
        />
        <Controller
          name={`entities.${index}.owner`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <AutocompleteField
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              placeholder={t('form.owner.placeholder')}
              entities={groups || []}
              type="search"
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.owner ? 'visible' : 'hidden',
          }}
        >
          {errors?.owner?.message
            ? t(errors.owner?.message as keyof typeof t)
            : '\u00A0'}
        </span>
      </div>
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
              <AutocompleteField
                freeSolo
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                placeholder={t('form.domainForm.type.placeholder')}
                type="select"
                options={Object.values(DomainTypes)}
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
          fieldName={t('form.domainForm.subdomainOf.fieldname')}
          tooltipText={t('form.domainForm.subdomainOf.tooltipText')}
        />
        <Controller
          name={`entities.${index}.subdomainOf`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Autocomplete
              multiple
              value={
                (value || [])
                  .map(str => {
                    return (domains || []).find(entity => {
                      const entityStr = `${entity.kind.toLowerCase()}:${entity.metadata.namespace?.toLowerCase() ?? 'default'}/${entity.metadata.name}`;
                      return entityStr === str;
                    });
                  })
                  .filter(Boolean) as Entity[]
              }
              onBlur={onBlur}
              onChange={(_, newValue) => {
                const names = newValue.map(item => {
                  return formatEntityString(item);
                });
                onChange(names);
              }}
              options={domains || []}
              getOptionLabel={option => {
                return `${option.metadata.title ?? option.metadata.name}`;
              }}
              isOptionEqualToValue={(option, selectedValue) => {
                const optionName = formatEntityString(option);
                const valueName = formatEntityString(selectedValue);
                return optionName === valueName;
              }}
              size="small"
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: 10,
                  height: 1,
                  padding: 1,
                },
              }}
              renderInput={params => (
                <MuiTextField
                  {...params}
                  placeholder={t('form.domainForm.subdomainOf.placeholder')}
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
            visibility: errors?.subdomainOf ? 'visible' : 'hidden',
          }}
        >
          {errors?.subdomainOf?.message
            ? t(errors?.subdomainOf?.message as keyof typeof t)
            : '\u00A0'}
        </span>
      </div>

      <TagField index={index} control={control} errors={errors} options={[]} />
    </Flex>
  );
};

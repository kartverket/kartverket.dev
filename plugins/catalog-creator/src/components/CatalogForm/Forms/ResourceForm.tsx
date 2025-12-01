import { Flex } from '@backstage/ui';
import {
  Control,
  Controller,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { EntityErrors, ResourceTypes } from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { FieldHeader } from '../FieldHeader';
import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import { AutocompleteField } from '../AutocompleteField';
import { TagField } from '../TagField';
import { useUpdateDependentFormFields } from '../../../hooks/useUpdateDependentFormFields';

export type ResourceFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  setValue: UseFormSetValue<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Resource'>;
  systems: Entity[];
  groups: Entity[];
  componentsAndResources: Entity[];
};

export const ResourceForm = ({
  index,
  control,
  setValue,
  errors,
  systems,
  groups,
  componentsAndResources,
}: ResourceFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  const formatEntityString = (entity: Entity): string => {
    return `${entity.kind.toLowerCase()}:${entity.metadata.namespace?.toLowerCase() ?? 'default'}/${entity.metadata.name}`;
  };

  const dependencyOfVal = useWatch({
    control,
    name: `entities.${index}.dependencyOf`,
  });

  useUpdateDependentFormFields(
    componentsAndResources,
    dependencyOfVal,
    `entities.${index}.dependencyOf`,
    setValue,
  );

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
            fieldName={t('form.APIForm.type.fieldName')}
            tooltipText={t('form.resourceForm.type.tooltipText')}
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
                placeholder={t('form.resourceForm.type.placeholder')}
                type="select"
                options={Object.values(ResourceTypes)}
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
          fieldName={t('form.resourceForm.system.fieldName')}
          tooltipText={t('form.resourceForm.system.tooltipText')}
        />
        <Controller
          name={`entities.${index}.system`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <AutocompleteField
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              placeholder={t('form.resourceForm.system.placeholder')}
              entities={systems}
              type="search"
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.system ? 'visible' : 'hidden',
          }}
        >
          {errors?.system?.message
            ? t(errors?.system?.message as keyof typeof t)
            : '\u00A0'}
        </span>
      </div>
      <div>
        <FieldHeader
          fieldName={t('form.resourceForm.dependencyof.fieldName')}
          tooltipText={t('form.resourceForm.dependencyof.tooltipText')}
        />
        <Controller
          name={`entities.${index}.dependencyOf`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Autocomplete
              multiple
              value={
                (value || [])
                  .map(str => {
                    return (componentsAndResources || []).find(entity => {
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
              options={componentsAndResources || []}
              getOptionLabel={option => {
                return `${option.metadata.title ?? option.metadata.name} (${option.kind.toLowerCase()})`;
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
                  placeholder={t('form.resourceForm.dependencyof.placeholder')}
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
            visibility: errors?.dependencyOf ? 'visible' : 'hidden',
          }}
        >
          {errors?.dependencyOf?.message
            ? t(errors?.dependencyOf?.message as keyof typeof t)
            : '\u00A0'}
        </span>
      </div>
      <TagField index={index} control={control} errors={errors} options={[]} />
    </Flex>
  );
};

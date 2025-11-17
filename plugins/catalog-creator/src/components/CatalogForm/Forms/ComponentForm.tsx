import { Flex } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';
import {
  AllowedLifecycleStages,
  ComponentTypes,
  EntityErrors,
  Kind,
} from '../../../types/types';
import { apiSchema, formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { FieldHeader } from '../FieldHeader';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import { AutocompleteField } from '../AutocompleteField';

export type ComponentFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Component'>;
  appendHandler: (entityKindToAdd: Kind, name?: string) => void;
  systems: Entity[];
};

export const ComponentForm = ({
  index,
  control,
  errors,
  appendHandler,
  systems,
}: ComponentFormProps) => {
  const catalogApi = useApi(catalogApiRef);
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  const formatEntityString = (entity: Entity): string => {
    return `${entity.kind.toLowerCase()}:${entity.metadata.namespace?.toLowerCase() ?? 'default'}/${entity.metadata.name}`;
  };

  const fetchAPIs = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: {
        kind: 'API',
      },
    });
    return results.items as Entity[];
  }, [catalogApi]);

  const fetchComponentsAndResources = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: [{ kind: ['Component', 'Resource'] }],
    });

    return results.items as Entity[];
  }, [catalogApi]);

  return (
    <Flex direction="column" justify="start">
      <Flex>
        <div style={{ width: '50%' }}>
          <FieldHeader
            fieldName={t('form.componentForm.lifecycle.fieldName')}
            tooltipText={t('form.componentForm.lifecycle.tooltipText')}
            required
          />
          <Controller
            name={`entities.${index}.lifecycle`}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <AutocompleteField
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                placeholder={t('form.componentForm.lifecycle.placeholder')}
                type="select"
                options={Object.values(AllowedLifecycleStages)}
              />
            )}
          />

          <span
            style={{
              color: 'red',
              fontSize: '0.75rem',
              visibility: errors?.lifecycle ? 'visible' : 'hidden',
            }}
          >
            {errors?.lifecycle?.message
              ? t(errors?.lifecycle?.message as keyof typeof t)
              : '\u00A0'}
          </span>
        </div>

        <div style={{ flexGrow: 1, width: '50%' }}>
          <FieldHeader
            fieldName="Type"
            tooltipText="The type of the component"
            required
          />
          <Controller
            name={`entities.${index}.entityType`}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <AutocompleteField
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                placeholder={t('form.componentForm.type.placeholder')}
                type="select"
                options={Object.values(ComponentTypes)}
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
          fieldName={t('form.componentForm.system.fieldName')}
          tooltipText={t('form.componentForm.system.tooltipText')}
        />
        <Controller
          name={`entities.${index}.system`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <AutocompleteField
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              placeholder={t('form.componentForm.system.placeholder')}
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
          fieldName={t('form.componentForm.providesAPIs.fieldName')}
          tooltipText={t('form.componentForm.providesAPIs.tooltipText')}
        />
        <Controller
          name={`entities.${index}.providesApis`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Autocomplete
              multiple
              freeSolo
              value={value || []}
              onBlur={onBlur}
              onChange={(_, newValue) => {
                const names = newValue.map(item => {
                  if (typeof item === 'string') {
                    if (
                      !fetchAPIs.value?.some(
                        api => api.metadata.name === item,
                      ) &&
                      !value?.some(oldInput => oldInput === item)
                    ) {
                      const result = apiSchema
                        .pick({ name: true })
                        .safeParse({ name: item });
                      if (result.success) {
                        appendHandler('API', item);
                      }
                    }
                    return item;
                  }
                  return item.metadata.name;
                });
                onChange(names);
              }}
              options={fetchAPIs.value || []}
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
                  placeholder={t('form.componentForm.providesAPIs.placeholder')}
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
            visibility: errors?.providesApis ? 'visible' : 'hidden',
          }}
        >
          {errors?.providesApis?.message
            ? t(errors?.providesApis?.message as keyof typeof t)
            : '\u00A0'}
        </span>
      </div>
      <div>
        <FieldHeader
          fieldName={t('form.componentForm.consumesAPIs.fieldName')}
          tooltipText={t('form.componentForm.consumesAPIs.tooltipText')}
        />
        <Controller
          name={`entities.${index}.consumesApis`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Autocomplete
              multiple
              freeSolo
              value={value || []}
              onBlur={onBlur}
              onChange={(_, newValue) => {
                const names = newValue.map(item =>
                  typeof item === 'string' ? item : item.metadata.name,
                );
                onChange(names);
              }}
              options={fetchAPIs.value || []}
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
                  placeholder={t('form.componentForm.consumesAPIs.placeholder')}
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
            visibility: errors?.consumesApis ? 'visible' : 'hidden',
          }}
        >
          {errors?.consumesApis?.message
            ? t(errors?.consumesApis?.message as keyof typeof t)
            : '\u00A0'}
        </span>
      </div>
      <div>
        <FieldHeader
          fieldName={t('form.componentForm.dependsOn.fieldName')}
          tooltipText={t('form.componentForm.dependsOn.tooltipText')}
        />
        <Controller
          name={`entities.${index}.dependsOn`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Autocomplete
              multiple
              value={
                (value || [])
                  .map(str => {
                    return (fetchComponentsAndResources.value || []).find(
                      entity => {
                        const entityStr = `${entity.kind.toLowerCase()}:${entity.metadata.namespace?.toLowerCase() ?? 'default'}/${entity.metadata.name}`;
                        return entityStr === str;
                      },
                    );
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
              options={fetchComponentsAndResources.value || []}
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
                  placeholder={t('form.componentForm.dependsOn.placeholder')}
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
            visibility: errors?.dependsOn ? 'visible' : 'hidden',
          }}
        >
          {errors?.dependsOn?.message
            ? t(errors?.dependsOn?.message as keyof typeof t)
            : '\u00A0'}
        </span>
      </div>
    </Flex>
  );
};

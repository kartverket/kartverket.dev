import { Flex } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';
import {
  AllowedLifecycleStages,
  ComponentTypes,
  EntityErrors,
  Kind,
} from '../../../model/types';
import { apiSchema, formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { FieldHeader } from '../FieldHeader';

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
      filter: [{ kind: 'Component' }, { kind: 'Resources' }],
    });
    return results.items as Entity[];
  }, [catalogApi]);

  return (
    <Flex direction="column" justify="start">
      <Flex>
        <div style={{ width: '50%' }}>
          <FieldHeader
            fieldName="Lifecycle"
            tooltipText="The lifecycle state of the component"
            required
          />
          <Controller
            name={`entities.${index}.lifecycle`}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Autocomplete
                value={value}
                onChange={(_, newValue) => {
                  onChange(newValue ?? '');
                }}
                onBlur={onBlur}
                options={Object.values(AllowedLifecycleStages)}
                getOptionLabel={option => option}
                size="small"
                renderInput={params => (
                  <MuiTextField
                    {...params}
                    placeholder="Select type"
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
              visibility: errors?.lifecycle ? 'visible' : 'hidden',
            }}
          >
            {errors?.lifecycle?.message || '\u00A0'}
          </span>
        </div>

        <div style={{ flexGrow: 1, width: '50%' }}>
          <FieldHeader
            fieldName="Type"
            tooltipText="The type of the component. It is recommended to choose one from the dropdown, but you can define your own type"
            required
          />
          <Controller
            name={`entities.${index}.entityType`}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Autocomplete
                freeSolo
                value={value}
                onChange={(_, newValue) => {
                  onChange(newValue ?? '');
                }}
                onBlur={onBlur}
                options={Object.values(ComponentTypes)}
                getOptionLabel={option => option}
                size="small"
                renderInput={params => (
                  <MuiTextField
                    {...params}
                    placeholder="Select type"
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
            {errors?.entityType?.message || '\u00A0'}
          </span>
        </div>
      </Flex>
      <div>
        <FieldHeader
          fieldName="System"
          tooltipText="Reference to the system which the component belongs to"
        />
        <Controller
          name={`entities.${index}.system`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Autocomplete
              value={
                value
                  ? (systems.find(entity => entity.metadata.name === value) ??
                    null)
                  : null
              }
              onBlur={onBlur}
              onChange={(_, newValue) => {
                const names = newValue?.metadata?.name ?? '';
                onChange(names);
              }}
              options={systems || []}
              getOptionLabel={option => {
                return option.metadata.name;
              }}
              filterOptions={(options, state) => {
                const inputValue = state.inputValue.toLowerCase();
                return options.filter(option => {
                  const name = option.metadata.name.toLowerCase();
                  const title = (option.metadata.title ?? '').toLowerCase();
                  return (
                    name.includes(inputValue) || title.includes(inputValue)
                  );
                });
              }}
              renderOption={(props, option) => {
                const label = option.metadata.title ?? option.metadata.name;
                return <li {...props}>{label}</li>;
              }}
              isOptionEqualToValue={(option, selectedValue) => {
                return option.metadata.name === selectedValue.metadata.name;
              }}
              size="small"
              renderInput={params => (
                <MuiTextField
                  {...params}
                  placeholder="Select system"
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
            visibility: errors?.system ? 'visible' : 'hidden',
          }}
        >
          {errors?.system?.message || '\u00A0'}
        </span>
      </div>
      <div>
        <FieldHeader
          fieldName="Provides APIs"
          tooltipText="References to all the APIs the component may provide. This does not define the API-entity itself"
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
                  placeholder="Select or create API..."
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
          {errors?.providesApis?.message || '\u00A0'}
        </span>
      </div>
      <div>
        <FieldHeader
          fieldName="Consumes APIs"
          tooltipText="APIs that are consumed by the component"
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
                  placeholder="Select or create API..."
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
          {errors?.consumesApis?.message || '\u00A0'}
        </span>
      </div>
      <div>
        <FieldHeader
          fieldName="Depends on"
          tooltipText="References to other components and/or resources that the component depends on"
        />
        <Controller
          name={`entities.${index}.dependsOn`}
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
              options={fetchComponentsAndResources.value || []}
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
                  placeholder="Select or create resource or component..."
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
          {errors?.dependsOn?.message || '\u00A0'}
        </span>
      </div>
    </Flex>
  );
};

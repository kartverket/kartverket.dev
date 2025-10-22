import { Flex } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';
import {
  AllowedLifecycleStages,
  ApiTypes,
  EntityErrors,
} from '../../../model/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { FieldHeader } from '../FieldHeader';
import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';

export type ApiFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'API'>;
  systems: Entity[];
};

export const ApiForm = ({ index, control, errors, systems }: ApiFormProps) => {
  return (
    <Flex direction="column" justify="start">
      <Flex>
        <div style={{ width: '50%' }}>
          <FieldHeader
            fieldName="Lifecycle"
            tooltipText="The lifecycle state of the API"
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
            tooltipText="The type of the API. It is recommended to choose one from the dropdown, but you can define your own type"
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
                options={Object.values(ApiTypes)}
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
          tooltipText="Reference to the system which the API belongs to"
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
          fieldName="API Definition (path or URL)"
          tooltipText="Relative path to the API definition file (OpenAPI, AsyncAPI, GraphQL, or gRPC). Required for new APIs. If editing an existing API this field may already be populated, check the existing catalog-info.yaml"
        />
        <Controller
          name={`entities.${index}.definition`}
          control={control}
          render={({ field }) => (
            <MuiTextField
              {...field}
              name="Definition"
              fullWidth
              size="small"
              inputProps={{
                style: {
                  fontSize: '0.85rem',
                  fontFamily: 'system-ui',
                },
              }}
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.definition ? 'visible' : 'hidden',
          }}
        >
          {errors?.definition?.message || '\u00A0'}
        </span>
      </div>
    </Flex>
  );
};

import { Button, Box, Flex, Select, Card, Text } from '@backstage/ui';
import DeleteIcon from '@mui/icons-material/Delete';
import type {
  EntityErrors,
  FormEntity,
  Kind,
  RequiredYamlFields,
} from '../../model/types';
import { AllowedLifecycleStages, AllowedEntityKinds } from '../../model/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { entitySchema, formSchema } from '../../schemas/formSchema';
import { ComponentForm } from './Forms/ComponentForm';
import { ApiForm } from './Forms/ApiForm';
import useAsync from 'react-use/esm/useAsync';

import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { useState } from 'react';
import Divider from '@mui/material/Divider';
import { SystemForm } from './Forms/SystemForm';
import { FieldHeader } from './FieldHeader';
import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { catalogCreatorTranslationRef } from '../../utils/translations';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

export type CatalogFormProps = {
  onSubmit: (data: FormEntity[]) => void;
  currentYaml: RequiredYamlFields[] | null;
  defaultName?: string;
};

export const CatalogForm = ({
  onSubmit,
  currentYaml,
  defaultName = '',
}: CatalogFormProps) => {
  const catalogApi = useApi(catalogApiRef);
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  const fetchOwners = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: {
        kind: 'group',
      },
    });

    return results.items as Entity[];
  }, [catalogApi]);

  const fetchSystems = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: {
        kind: 'system',
      },
    });
    return results.items as Entity[];
  }, [catalogApi]);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      entities: currentYaml
        ? currentYaml.map((entry: RequiredYamlFields, index) => {
            const definition =
              typeof entry.spec.definition !== 'string'
                ? entry.spec.definition?.$text
                : undefined;

            return {
              id: index,
              kind: entry.kind as Kind,
              name: entry.metadata.name,
              owner: entry.spec.owner,
              lifecycle: entry.spec.lifecycle as AllowedLifecycleStages,
              entityType: entry.spec.type as string,
              system: entry.spec.system,
              providesApis: entry.spec.providesApis,
              consumesApis: entry.spec.consumesApis,
              dependencyOf: entry.spec.dependencyOf,
              definition: definition,
              title: entry.metadata.title || '',
            };
          })
        : [
            {
              id: 0,
              kind: 'Component',
              name: defaultName,
              owner: '',
              title: '',
            },
          ],
    },
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'entities',
    keyName: 'key',
    control,
  });
  const [indexCount, setIndexCount] = useState(fields.length);
  const [addEntityKind, setAddEntityKind] = useState<Kind>('Component');

  const appendHandler = (entityKindToAdd: Kind, name = '') => {
    let entity: z.infer<typeof entitySchema>;
    switch (entityKindToAdd) {
      case 'Component' as Kind:
        entity = {
          id: indexCount,
          kind: entityKindToAdd,
          name: name,
          owner: '',
          lifecycle: AllowedLifecycleStages.production,
          entityType: '',
          system: '',
          title: '',
        };
        break;
      case 'API' as Kind:
        entity = {
          id: indexCount,
          kind: entityKindToAdd,
          name: name,
          owner: '',
          lifecycle: AllowedLifecycleStages.production,
          entityType: '',
          system: '',
          definition: '',
          title: '',
        };
        break;
      case 'System' as Kind:
        entity = {
          id: indexCount,
          kind: addEntityKind,
          name: '',
          owner: '',
          lifecycle: AllowedLifecycleStages.production,
          entityType: '',
          system: '',
          definition: '',
          title: '',
        };
        break;
      default:
        entity = {
          id: indexCount,
          kind: addEntityKind,
          name: name,
          owner: '',
          lifecycle: AllowedLifecycleStages.production,
          entityType: '',
          system: '',
          title: '',
        };
    }
    setIndexCount(prev => prev + 1);
    append(entity);
  };

  const getEntityForm = (
    entity: z.infer<typeof entitySchema>,
    index: number,
  ) => {
    switch (entity.kind) {
      case 'Component':
        return (
          <ComponentForm
            index={index}
            control={control}
            errors={errors?.entities?.[index] as EntityErrors<'Component'>}
            appendHandler={appendHandler}
            systems={fetchSystems.value || []}
          />
        );
      case 'API':
        return (
          <ApiForm
            index={index}
            control={control}
            errors={errors?.entities?.[index] as EntityErrors<'API'>}
            systems={fetchSystems.value || []}
          />
        );
      case 'System':
        return (
          <SystemForm
            index={index}
            control={control}
            errors={errors?.entities?.[index] as EntityErrors<'System'>}
            owners={fetchOwners.value || []}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(data => {
          onSubmit(data.entities as FormEntity[]);
        })}
      >
        <Box px="2rem">
          <h2>{t('form.title')}</h2>
          <p style={{ fontSize: '0.85rem', color: 'gray' }}>
            {t('form.requiredFields')}
            <span style={{ color: '#ff0000', fontSize: '1rem' }}>*</span>
          </p>
          {fields.map((entity, index) => {
            return (
              <Card
                style={{
                  marginRight: '1rem',
                  marginBottom: '1rem',
                  padding: '1rem',
                  position: 'relative',
                  overflow: 'visible',
                }}
                key={entity.key}
              >
                <Flex direction="column" justify="start">
                  <Flex justify="between">
                    <div>
                      <Controller
                        name={`entities.${index}.kind`}
                        control={control}
                        render={({ field: { value } }) => (
                          <h3 aria-label="entity-header">
                            {' '}
                            {`${value}${t('form.entity')}`}{' '}
                          </h3>
                        )}
                      />
                    </div>
                    {index !== 0 && (
                      <Button
                        style={{ width: '40px', alignSelf: 'flex-end' }}
                        onClick={() => remove(index)}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                  </Flex>

                  <div style={{ width: '100%' }}>
                    <FieldHeader
                      fieldName={t('form.name.fieldName')}
                      required
                      tooltipText={t('form.name.tooltipText')}
                    />
                    <Controller
                      name={`entities.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <MuiTextField
                          {...field}
                          name="Name"
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
                        visibility: errors?.entities ? 'visible' : 'hidden',
                      }}
                    >
                      {errors?.entities?.[index]?.name?.message
                        ? t(
                            errors.entities[index]?.name
                              ?.message as keyof typeof t,
                          )
                        : '\u00A0'}
                    </span>
                  </div>
                  <div>
                    <FieldHeader
                      fieldName="Title"
                      tooltipText="A human-readable title for the component entity, shown in Backstage UI instead of the name when available. Optional."
                    />
                    <Controller
                      name={`entities.${index}.title`}
                      control={control}
                      render={({ field }) => (
                        <MuiTextField
                          {...field}
                          name="Title"
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
                        visibility: errors?.entities ? 'visible' : 'hidden',
                      }}
                    >
                      {errors?.entities?.[index]?.title?.message || '\u00A0'}
                    </span>
                  </div>
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
                        <Autocomplete
                          value={
                            value
                              ? (fetchOwners?.value?.find(
                                  ownerEntity =>
                                    ownerEntity.metadata.name === value,
                                ) ?? null)
                              : null
                          }
                          onBlur={onBlur}
                          onChange={(_, newValue) => {
                            const names = newValue?.metadata?.name ?? '';
                            onChange(names);
                          }}
                          options={fetchOwners.value || []}
                          getOptionLabel={option => {
                            return option.metadata.name;
                          }}
                          filterOptions={(options, state) => {
                            const inputValue = state.inputValue.toLowerCase();
                            return options.filter(option => {
                              const name = option.metadata.name.toLowerCase();
                              const title = (
                                option.metadata.title ?? ''
                              ).toLowerCase();
                              return (
                                name.includes(inputValue) ||
                                title.includes(inputValue)
                              );
                            });
                          }}
                          renderOption={(props, option) => {
                            const label =
                              option.metadata.title ?? option.metadata.name;
                            return <li {...props}>{label}</li>;
                          }}
                          isOptionEqualToValue={(option, selectedValue) => {
                            return (
                              option.metadata.name ===
                              selectedValue.metadata.name
                            );
                          }}
                          size="small"
                          renderInput={params => (
                            <MuiTextField
                              {...params}
                              placeholder={t('form.owner.placeholder')}
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
                        visibility: errors.entities?.[index]?.owner
                          ? 'visible'
                          : 'hidden',
                      }}
                    >
                      {errors?.entities?.[index]?.owner?.message
                        ? t(
                            errors.entities[index]?.owner
                              ?.message as keyof typeof t,
                          )
                        : '\u00A0'}
                    </span>
                  </div>

                  {getEntityForm(entity, index)}
                </Flex>
              </Card>
            );
          })}

          <Flex direction="column">
            <Text style={{ fontWeight: 'bold', marginTop: '1.5rem' }}>
              {t('form.addEntity.title')}
            </Text>
            <Flex align="end" justify="start">
              <Select
                label={t('form.addEntity.label')}
                value={addEntityKind}
                onChange={value => setAddEntityKind(value as Kind)}
                options={Object.values(AllowedEntityKinds).map(
                  lifecycleStage => ({
                    value: lifecycleStage as string,
                    label: lifecycleStage,
                  }),
                )}
              />
              <Button
                type="button"
                onClick={() => appendHandler(addEntityKind)}
              >
                {t('form.addEntity.buttonText')}
              </Button>
            </Flex>
          </Flex>
          <Divider sx={{ marginY: '1.5rem' }} />
          <Flex justify="end">
            <Button
              variant="primary"
              type="submit"
              style={{ marginBottom: '0.75rem' }}
            >
              {t('form.createPR')}
            </Button>
          </Flex>
        </Box>
      </form>
    </>
  );
};

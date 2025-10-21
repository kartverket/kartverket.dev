import {
  Button,
  Box,
  Flex,
  Select,
  Icon,
  Card,
  Text,
  TextField,
} from '@backstage/ui';

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
import CatalogSearch from '../CatalogSearch';
import { SystemForm } from './Forms/SystemForm';
import { FieldHeader } from './FieldHeader';

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
            };
          })
        : [
            {
              id: 0,
              kind: 'Component',
              name: defaultName,
              owner: '',
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
          <h2>Catalog-info.yaml Form</h2>
          {fields.map((entity, index) => {
            return (
              <Card
                style={{
                  marginRight: '1rem',
                  marginTop: '1rem',
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
                            {`${value} Entity`}{' '}
                          </h3>
                        )}
                      />
                    </div>
                    {index !== 0 && (
                      <Button
                        style={{ width: '40px', alignSelf: 'flex-end' }}
                        onClick={() => remove(index)}
                      >
                        <Icon name="trash" />
                      </Button>
                    )}
                  </Flex>

                  <div>
                    <FieldHeader
                      fieldName="Name"
                      required
                      tooltipText="The name of the component entity. This name is both meant for human eyes to recognize the entity, and for machines and other components to reference the entity. Must be unique"
                    />
                    <Controller
                      name={`entities.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} name="Name" />
                      )}
                    />

                    <span
                      style={{
                        color: 'red',
                        fontSize: '0.75rem',
                        visibility: errors?.entities ? 'visible' : 'hidden',
                      }}
                    >
                      {errors?.entities?.[index]?.name?.message || '\u00A0'}
                    </span>
                  </div>
                  <div>
                    <FieldHeader
                      fieldName="Owner"
                      tooltipText="A reference to the owner (commonly a team), that bears ultimate responsibility for the component, and has the authority and capability to develop and maintain it"
                      required
                    />
                    <Controller
                      name={`entities.${index}.owner`}
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <CatalogSearch
                          onChange={onChange}
                          onBlur={onBlur}
                          value={value}
                          entityList={fetchOwners.value || []}
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
                      {errors.entities?.[index]?.owner?.message || '\u00A0'}
                    </span>
                  </div>

                  {getEntityForm(entity, index)}
                </Flex>
              </Card>
            );
          })}

          <Flex direction="column">
            <Text style={{ fontWeight: 'bold', marginTop: '1.5rem' }}>
              Add Entity
            </Text>
            <Flex align="end" justify="start">
              <Select
                label="Select kind"
                selectedKey={addEntityKind}
                onSelectionChange={value => setAddEntityKind(value as Kind)}
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
                Add Entity
              </Button>
            </Flex>
          </Flex>
          <Divider sx={{ marginY: '1.5rem' }} />
          <Flex justify="end">
            <Button variant="primary" type="submit">
              Create pull request
            </Button>
          </Flex>
        </Box>
      </form>
    </>
  );
};

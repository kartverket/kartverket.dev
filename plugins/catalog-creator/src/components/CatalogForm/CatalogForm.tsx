import { Button, Box, Flex, Select, Card, Text } from '@backstage/ui';
import DeleteIcon from '@mui/icons-material/Delete';
import type {
  EntityErrors,
  FormEntity,
  Kind,
  RequiredYamlFields,
} from '../../types/types';
import {
  AllowedLifecycleStages,
  AllowedEntityKinds,
  Kinds,
} from '../../types/types';
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
import MuiTextField from '@mui/material/TextField';
import { catalogCreatorTranslationRef } from '../../utils/translations';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { ResourceForm } from './Forms/ResourceForm';
import { DomainForm } from './Forms/DomainForm';

import style from '../../catalog.module.css';

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

  const [indexCount, setIndexCount] = useState(
    currentYaml ? currentYaml.length : 0,
  );
  const [addEntityKind, setAddEntityKind] = useState<Kind>('Component');

  const handleKeyDown = (event: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const fetchGroups = useAsync(async () => {
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

  const isKind = (input_kind: string): input_kind is Kind => {
    return Object.values(Kinds).includes(input_kind as Kind);
  };

  const getEntitiesWithInlineAPIDef = (yamlList: RequiredYamlFields[]) => {
    return yamlList.flatMap((element, index) => {
      if (element.kind === 'API') {
        if (typeof element.spec.definition === 'string') {
          return index;
        }
      }
      return [];
    });
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      entities: currentYaml
        ? currentYaml.flatMap((entry: RequiredYamlFields, index) => {
            if (!isKind(entry.kind)) return [];
            const definition =
              typeof entry.spec.definition !== 'string'
                ? (entry.spec.definition?.$text ??
                  entry.spec.definition?.$openapi ??
                  entry.spec.definition?.$graphql ??
                  entry.spec.definition?.$asyncapi)
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
              tags: entry.metadata.tags || [],
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
          definition: '',
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
          definition: '',
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
            groups={fetchGroups.value || []}
          />
        );
      case 'API':
        return (
          <ApiForm
            index={index}
            control={control}
            errors={errors?.entities?.[index] as EntityErrors<'API'>}
            systems={fetchSystems.value || []}
            groups={fetchGroups.value || []}
            inlineApiIndexes={getEntitiesWithInlineAPIDef(currentYaml || [])}
            id={entity.id}
          />
        );
      case 'System':
        return (
          <SystemForm
            index={index}
            control={control}
            errors={errors?.entities?.[index] as EntityErrors<'System'>}
            groups={fetchGroups.value || []}
          />
        );
      case 'Resource':
        return (
          <ResourceForm
            index={index}
            control={control}
            errors={errors?.entities?.[index] as EntityErrors<'Resource'>}
            systems={fetchSystems.value || []}
            groups={fetchGroups.value || []}
          />
        );
      case 'Domain':
        return (
          <DomainForm
            index={index}
            control={control}
            errors={errors?.entities?.[index] as EntityErrors<'Domain'>}
            groups={fetchGroups.value || []}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      {/* Prevent form submission on enter */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <form
        onSubmit={handleSubmit(data => {
          onSubmit(data.entities as FormEntity[]);
        })}
        onKeyDown={handleKeyDown}
      >
        <Box px="2rem">
          <h2>{t('form.title')}</h2>
          <p className={style.formInfoText}>
            {t('form.requiredFields')}
            <span className={style.requiredMark}>*</span>
          </p>
          {fields.map((entity, index) => {
            return (
              <Card className={style.entityCard} key={entity.key}>
                <Flex justify="between">
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
                  {index !== 0 && (
                    <Button
                      className={style.deleteEntityButton}
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
                          className: style.textField,
                        }}
                      />
                    )}
                  />
                  <span
                    className={`${style.errorText} ${errors?.entities ? '' : style.hidden}`}
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
                    fieldName={t('form.titleField.fieldName')}
                    tooltipText={t('form.titleField.tooltipText')}
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
                          className: style.textField,
                        }}
                      />
                    )}
                  />
                  <span
                    className={`${style.errorText} ${errors?.entities ? '' : style.hidden}`}
                  >
                    {errors?.entities?.[index]?.title?.message || '\u00A0'}
                  </span>
                </div>

                {getEntityForm(entity, index)}
              </Card>
            );
          })}

          <Flex direction="column">
            <Text className={style.addEntityTitle}>
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
          <Divider className={style.endOfFormDivider} />
          <Flex justify="end">
            <Button
              variant="primary"
              type="submit"
              className={style.createPRButton}
            >
              {t('form.createPR')}
            </Button>
          </Flex>
        </Box>
      </form>
    </>
  );
};

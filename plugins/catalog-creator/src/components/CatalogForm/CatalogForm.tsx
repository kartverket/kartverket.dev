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
import { useState } from 'react';
import Divider from '@mui/material/Divider';
import { SystemForm } from './Forms/SystemForm';
import { FieldHeader } from './FieldHeader';
import MuiTextField from '@mui/material/TextField';
import { catalogCreatorTranslationRef } from '../../utils/translations';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { ResourceForm } from './Forms/ResourceForm';
import { DomainForm } from './Forms/DomainForm';
import { useFetchEntities } from '../../hooks/useFetchEntities';

import style from '../../catalog.module.css';
import { toEntityRef, toEntityRefList } from '../../utils/toEntityRef';
import { FunctionForm } from './Forms/FunctionForm';
import { EntityDescription } from './EntityDescription';
import CallMergeIcon from '@mui/icons-material/CallMerge';

export type CatalogFormProps = {
  onSubmit: (data: FormEntity[]) => void;
  currentYaml: RequiredYamlFields[] | null;
  defaultName?: string;
  createFunction?: boolean;
};

export const CatalogForm = ({
  onSubmit,
  currentYaml,
  defaultName = '',
  createFunction,
}: CatalogFormProps) => {
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
    setValue,
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
              system: entry.spec.system
                ? toEntityRef(Kinds.System, entry.spec.system)
                : undefined,
              providesApis: toEntityRefList(
                Kinds.API,
                entry.spec.providesApis ?? [],
              ),
              consumesApis: toEntityRefList(
                Kinds.API,
                entry.spec.consumesApis ?? [],
              ),
              dependencyOf: entry.spec.dependencyOf,
              parentFunction: entry.spec.parentFunction,
              dependsOnFunctions: entry.spec.dependsOnFunctions,
              dependsOnSystems: entry.spec.dependsOnSystems,
              dependsOnComponents: entry.spec.dependsOnComponents,
              definition: definition,
              title: entry.metadata.title || '',
              tags: entry.metadata.tags || [],
              dependsOn: entry.spec.dependsOn,
            };
          })
        : [
            {
              id: 0,
              kind: createFunction ? 'Function' : 'Component',
              name: createFunction ? '' : defaultName,
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

  const fetchSystems = useFetchEntities(control, Kinds.System);
  const fetchComponents = useFetchEntities(control, Kinds.Component);
  const fetchResources = useFetchEntities(control, Kinds.Resource);
  const fetchDomains = useFetchEntities(control, Kinds.Domain);
  const fetchFunctions = useFetchEntities(control, Kinds.Function);
  const fetchGroups = useFetchEntities(control, Kinds.Group);

  const componentsAndResources = {
    loading: fetchComponents.loading || fetchResources.loading,
    error: fetchComponents.error || fetchResources.error,
    value: [...fetchComponents.value, ...fetchResources.value],
  };

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
          parentFunction: '',
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
          parentFunction: '',
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
          parentFunction: '',
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
          parentFunction: '',
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
            setValue={setValue}
            systems={fetchSystems}
            groups={fetchGroups}
            componentsAndResources={componentsAndResources}
          />
        );
      case 'API':
        return (
          <ApiForm
            index={index}
            control={control}
            errors={errors?.entities?.[index] as EntityErrors<'API'>}
            systems={fetchSystems}
            groups={fetchGroups}
            inlineApiIndexes={getEntitiesWithInlineAPIDef(currentYaml || [])}
            id={entity.id}
            setValue={setValue}
          />
        );
      case 'System':
        return (
          <SystemForm
            index={index}
            control={control}
            setValue={setValue}
            errors={errors?.entities?.[index] as EntityErrors<'System'>}
            groups={fetchGroups}
            domains={fetchDomains}
          />
        );
      case 'Resource':
        return (
          <ResourceForm
            index={index}
            control={control}
            setValue={setValue}
            errors={errors?.entities?.[index] as EntityErrors<'Resource'>}
            systems={fetchSystems}
            groups={fetchGroups}
            componentsAndResources={componentsAndResources}
          />
        );
      case 'Domain':
        return (
          <DomainForm
            index={index}
            control={control}
            errors={errors?.entities?.[index] as EntityErrors<'Domain'>}
            groups={fetchGroups || []}
            domains={fetchDomains || []}
          />
        );
      case 'Function':
        return (
          <FunctionForm
            index={index}
            control={control}
            errors={errors?.entities?.[index] as EntityErrors<'Domain'>}
            groups={fetchGroups || []}
            components={fetchComponents}
            functions={fetchFunctions}
            systems={fetchSystems}
            setValue={setValue}
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
        <Box className={style.catalogForm}>
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
                <Controller
                  name={`entities.${index}.kind`}
                  control={control}
                  render={({ field: { value } }) => (
                    <EntityDescription entityKind={value} />
                  )}
                />

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

          {fields.find(x => x.kind === 'Function') === undefined && (
            <Flex direction="column">
              <Text className={style.addEntityTitle}>
                {t('form.addEntity.title')}
              </Text>
              <Flex align="end" justify="start">
                <Select
                  label={t('form.addEntity.label')}
                  value={addEntityKind}
                  className={style.selectKind}
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
                  variant="secondary"
                  onClick={() => appendHandler(addEntityKind)}
                >
                  {t('form.addEntity.buttonText')}
                </Button>
              </Flex>
              <EntityDescription entityKind={addEntityKind} />
            </Flex>
          )}
          <Divider className={style.endOfFormDivider} />
          <Box className={style.infoText}>
            <Flex align="center" gap="sm">
              <CallMergeIcon className={style.icon} />
              <Flex direction="column">
                <Text>{t('formInfo.p2')}</Text>
              </Flex>
            </Flex>
          </Box>
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

import { Flex } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';
import {
  AllowedLifecycleStages,
  ApiTypes,
  EntityErrors,
} from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { FieldHeader } from '../FieldHeader';
import MuiTextField from '@mui/material/TextField';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import { AutocompleteField } from '../AutocompleteField';
import Alert from '@mui/material/Alert';

export type ApiFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'API'>;
  systems: Entity[];
  groups: Entity[];
  inlineApiIndexes: number[];
};

export const ApiForm = ({
  index,
  control,
  errors,
  systems,
  groups,
  // inlineApiIndexes,
}: ApiFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  const getAPIDefinitionBanner = (
    definitionValue:
      | string
      | {
          $text: string;
        },
  ) => {
    if (typeof definitionValue === 'string' && definitionValue.length > 0) {
      return (
        <Alert severity="info">
          {t('form.APIForm.inlineDefinitionInfo.text')}
        </Alert>
      );
    }
    return <></>;
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
        <div style={{ width: '50%' }}>
          <FieldHeader
            fieldName={t('form.APIForm.lifecycle.fieldName')}
            tooltipText={t('form.APIForm.lifecycle.tooltipText')}
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
                placeholder={t('form.APIForm.lifecycle.placeholder')}
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
            fieldName={t('form.APIForm.type.fieldName')}
            tooltipText={t('form.APIForm.type.tooltipText')}
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
                placeholder={t('form.APIForm.type.placeholder')}
                type="select"
                options={Object.values(ApiTypes)}
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
          fieldName={t('form.APIForm.system.fieldName')}
          tooltipText={t('form.APIForm.system.tooltipText')}
        />
        <Controller
          name={`entities.${index}.system`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <AutocompleteField
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              placeholder={t('form.APIForm.system.placeholder')}
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
        {/* {inlineApiIndexes.includes(index) && (
          <Alert sx={{ my: 2 }} severity="info">
            {t('form.APIForm.inlineDefinitionInfo.text')}
          </Alert>
        )} */}
        <FieldHeader
          fieldName={t('form.APIForm.definition.fieldName')}
          tooltipText={t('form.APIForm.definition.tooltipText')}
          required
        />
        <Controller
          name={`entities.${index}.definition`}
          control={control}
          render={({ field }) => (
            <div>
              {getAPIDefinitionBanner(field.value)}
              <div>{typeof field.value}</div>
              <MuiTextField
                {...field}
                value={
                  typeof field.value !== 'string'
                    ? field.value.$text
                    : undefined
                }
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
            </div>
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.definition ? 'visible' : 'hidden',
          }}
        >
          {errors?.definition?.message
            ? t(errors?.definition?.message as keyof typeof t)
            : '\u00A0'}
        </span>
      </div>
    </Flex>
  );
};

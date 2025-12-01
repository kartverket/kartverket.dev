import { Flex } from '@backstage/ui';
import { Control, Controller, FieldError } from 'react-hook-form';
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
import { TagField } from '../TagField';

import style from '../../../catalog.module.css';

export type ApiFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'API'>;
  systems: Entity[];
  groups: Entity[];
  inlineApiIndexes: number[];
  id: number;
};



export const ApiForm = ({
  index,
  control,
  errors,
  systems,
  groups,
  inlineApiIndexes,
  id,
}: ApiFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  const errorText = (text: FieldError | undefined) => {
    return(
        <span className={`${style.errorText} ${text? '' : style.hidden}`}>
          {text?.message
            ? t(text?.message as keyof typeof t)
            : '\u00A0'}
        </span>
    )};
  
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
        {errorText(errors?.owner)}
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
          {errorText(errors?.lifecycle)}
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
          {errorText(errors?.entityType)}
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
        {errorText(errors?.system)}
      </div>
      <div>
        {inlineApiIndexes.includes(id) && (
          <Alert sx={{ my: 2 }} severity="info">
            {t('form.APIForm.inlineDefinitionInfo.text')}
          </Alert>
        )}
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
            </div>
          )}
        />
        {errorText(errors?.definition)}
      </div>
      <TagField
        index={index}
        control={control}
        errors={errors}
        options={['internal', 'public']}
      />
    </Flex>
  );
};

import { Flex } from '@backstage/ui';
import {
  Control,
  Controller,
  FieldError,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
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
import Alert from '@mui/material/Alert';
import { TagField } from '../Autocompletes/TagField';
import { SingleEntityAutocomplete } from '../Autocompletes/SingleEntityAutocomplete';
import { SingleSelectAutocomplete } from '../Autocompletes/SingleSelectAutocomplete';

import style from '../../../catalog.module.css';
import { useUpdateDependentFormFields } from '../../../hooks/useUpdateDependentFormFields';

export type ApiFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'API'>;
  systems: {
    loading: boolean;
    error: Error | undefined;
    value: Entity[];
  };
  groups: {
    loading: boolean;
    error: Error | undefined;
    value: Entity[];
  };
  inlineApiIndexes: number[];
  id: number;
  setValue: UseFormSetValue<z.infer<typeof formSchema>>;
};

export const ApiForm = ({
  index,
  control,
  errors,
  systems,
  groups,
  inlineApiIndexes,
  id,
  setValue,
}: ApiFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  const systemVal = useWatch({
    control,
    name: `entities.${index}.system`,
  });

  useUpdateDependentFormFields(
    systems,
    typeof systemVal === 'string' ? [systemVal] : undefined,
    `entities.${index}.system`,
    setValue,
    true,
  );

  const errorText = (text: FieldError | undefined) => {
    return (
      <span className={`${style.errorText} ${text ? '' : style.hidden}`}>
        {text?.message ? t(text?.message as keyof typeof t) : '\u00A0'}
      </span>
    );
  };

  return (
    <Flex direction="column" justify="start">
      <div>
        <SingleEntityAutocomplete
          index={index}
          control={control}
          errors={errors}
          fieldname="owner"
          entities={groups.value || []}
          required
        />
      </div>
      <Flex>
        <div style={{ width: '50%' }}>
          <SingleSelectAutocomplete
            index={index}
            control={control}
            errors={errors}
            formname="APIForm"
            fieldname="lifecycle"
            options={Object.values(AllowedLifecycleStages)}
            required
          />
        </div>
        <div style={{ flexGrow: 1, width: '50%' }}>
          <SingleSelectAutocomplete
            index={index}
            control={control}
            errors={errors}
            formname="APIForm"
            fieldname="entityType"
            freeSolo
            options={Object.values(ApiTypes)}
            required
          />
        </div>
      </Flex>

      <div>
        <SingleEntityAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="APIForm"
          fieldname="system"
          entities={systems.value || []}
        />
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
                  className: style.textField,
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

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
import Alert from '@mui/material/Alert';
import { TagField } from '../Autocompletes/TagField';
import { SingleEntityAutocomplete } from '../Autocompletes/SingleEntityAutocomplete';
import { SingleSelectAutocomplete } from '../Autocompletes/SingleSelectAutocomplete';

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
          entities={groups || []}
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
          entities={systems || []}
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

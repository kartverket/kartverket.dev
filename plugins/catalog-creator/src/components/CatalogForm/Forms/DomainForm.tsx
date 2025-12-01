import { Flex } from '@backstage/ui';
import { Control, Controller, FieldError, Merge } from 'react-hook-form';
import { DomainTypes, EntityErrors } from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { FieldHeader } from '../FieldHeader';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import { AutocompleteField } from '../AutocompleteField';
import { Entity } from '@backstage/catalog-model';
import { TagField } from '../TagField';

import style from '../../../catalog.module.css';

export type DomainFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Resource'>;
  groups: Entity[];
};

export const DomainForm = ({
  index,
  control,
  errors,
  groups,
}: DomainFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

   const errorText = (text: FieldError | undefined | Merge<FieldError, (FieldError | undefined)[]>) => {
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
        <div style={{ flexGrow: 1, width: '50%' }}>
          <FieldHeader
            fieldName={t('form.domainForm.type.fieldname')}
            tooltipText={t('form.domainForm.type.tooltipText')}
            required
          />
          <Controller
            name={`entities.${index}.entityType`}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <AutocompleteField
                freeSolo
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                placeholder={t('form.domainForm.type.placeholder')}
                type="select"
                options={Object.values(DomainTypes)}
              />
            )}
          />
          {errorText(errors?.entityType)}
        </div>
      </Flex>
      <TagField index={index} control={control} errors={errors} options={[]} />
    </Flex>
  );
};

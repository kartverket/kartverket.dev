import { Flex } from '@backstage/ui';
import { Control, Controller, FieldError, Merge } from 'react-hook-form';
import { EntityErrors, SystemTypes } from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { FieldHeader } from '../FieldHeader';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import { AutocompleteField } from '../AutocompleteField';
import { TagField } from '../TagField';

import style from '../../../catalog.module.css';

export type SystemFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'System'>;
  groups: Entity[];
};

export const SystemForm = ({
  index,
  control,
  errors,
  groups,
}: SystemFormProps) => {
  const catalogApi = useApi(catalogApiRef);
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  const errorText = (text: FieldError | undefined | Merge<FieldError, (FieldError | undefined)[]>) => {
  return(
      <span className={`${style.errorText} ${text? '' : style.hidden}`}>
        {text?.message
          ? t(text?.message as keyof typeof t)
          : '\u00A0'}
      </span>
  )};

  const fetchDomains = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: {
        kind: 'Domain',
      },
    });
    return results.items as Entity[];
  }, [catalogApi]);

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
            fieldName={t('form.systemForm.type.fieldName')}
            tooltipText={t('form.systemForm.type.tooltipText')}
          />
          <Controller
            name={`entities.${index}.systemType`}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <AutocompleteField
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                options={Object.values(SystemTypes)}
                placeholder={t('form.systemForm.type.placeholder')}
                type="select"
              />
            )}
          />
          {errorText(errors?.entityType)}

        </div>
      </Flex>
      <div>
        <FieldHeader
          fieldName={t('form.systemForm.domain.fieldName')}
          tooltipText={t('form.systemForm.domain.tooltipText')}
        />
        <Controller
          name={`entities.${index}.domain`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <AutocompleteField
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              entities={fetchDomains.value || []}
              type="search"
              placeholder={t('form.systemForm.domain.placeholder')}
            />
          )}
        />
        {errorText(errors?.domain)}

      </div>
      <TagField index={index} control={control} errors={errors} options={[]} />
    </Flex>
  );
};

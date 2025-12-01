import { Flex } from '@backstage/ui';
import {
  Control,
  Controller,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { EntityErrors, SystemTypes } from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { FieldHeader } from '../FieldHeader';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import { AutocompleteField } from '../AutocompleteField';
import { TagField } from '../TagField';
import { useUpdateDependentFormFields } from '../../../hooks/useUpdateDependentFormFields';

export type SystemFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  setValue: UseFormSetValue<z.infer<typeof formSchema>>;
  errors: EntityErrors<'System'>;
  groups: Entity[];
  domains: Entity[];
};

export const SystemForm = ({
  index,
  control,
  setValue,
  errors,
  groups,
  domains,
}: SystemFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  const domainVal = useWatch({
    control,
    name: `entities.${index}.domain`,
  });

  useUpdateDependentFormFields(
    domains,
    domainVal ? [domainVal] : undefined,
    `entities.${index}.domain`,
    setValue,
  );

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
              entities={domains || []}
              type="search"
              placeholder={t('form.systemForm.domain.placeholder')}
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.domain ? 'visible' : 'hidden',
          }}
        >
          {errors?.domain?.message
            ? t(errors?.domain?.message as keyof typeof t)
            : '\u00A0'}
        </span>
      </div>
      <TagField index={index} control={control} errors={errors} options={[]} />
    </Flex>
  );
};

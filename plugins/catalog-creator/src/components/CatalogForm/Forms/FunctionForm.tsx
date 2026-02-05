import { Button, Flex } from '@backstage/ui';
import {
  Control,
  useFieldArray,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { EntityErrors } from '../../../types/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import { TagField } from '../Autocompletes/TagField';
import { SingleEntityAutocomplete } from '../Autocompletes/SingleEntityAutocomplete';
import { MultipleEntitiesAutocomplete } from '../Autocompletes/MultipleEntitiesAutocomplete';
import { useUpdateDependentFormFields } from '../../../hooks/useUpdateDependentFormFields';
import { FieldHeader } from '../FieldHeader';
import { LinkCard } from '../LinkCard';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';

export type FunctionFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Function'>;
  groups: {
    loading: boolean;
    error: Error | undefined;
    value: Entity[];
  };
  setValue: UseFormSetValue<z.infer<typeof formSchema>>;
  components: {
    loading: boolean;
    error: Error | undefined;
    value: Entity[];
  };
  functions: {
    loading: boolean;
    error: Error | undefined;
    value: Entity[];
  };
  systems: {
    loading: boolean;
    error: Error | undefined;
    value: Entity[];
  };
};

export const FunctionForm = ({
  index,
  control,
  errors,
  groups,
  setValue,
  components,
  functions,
  systems,
}: FunctionFormProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);
  const systemVal = useWatch({
    control,
    name: `entities.${index}.system`,
  });

  const functionVal = useWatch({
    control,
    name: `entities.${index}.dependsOnFunctions`,
  });

  const componentVal = useWatch({
    control,
    name: `entities.${index}.dependsOnComponents`,
  });

  useUpdateDependentFormFields(
    functions,
    typeof componentVal === 'string' ? [componentVal] : undefined,
    `entities.${index}.dependsOnComponents`,
    setValue,
  );

  useUpdateDependentFormFields(
    functions,
    typeof functionVal === 'string' ? [functionVal] : undefined,
    `entities.${index}.dependsOnFunctions`,
    setValue,
  );

  useUpdateDependentFormFields(
    functions,
    typeof functionVal === 'string' ? [functionVal] : undefined,
    `entities.${index}.parentFunction`,
    setValue,
  );

  useUpdateDependentFormFields(
    systems,
    typeof systemVal === 'string' ? [systemVal] : undefined,
    `entities.${index}.system`,
    setValue,
  );

  const {
    fields: links,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    name: `entities.${index}.links` as `entities.0.links`,
    control,
  });

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
      <div>
        <SingleEntityAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="functionForm"
          fieldname="parentFunction"
          entities={functions.value || []}
          required
        />
      </div>
      <div>
        <MultipleEntitiesAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="functionForm"
          fieldname="dependsOnComponents"
          entities={components.value || []}
        />
      </div>
      <div>
        <MultipleEntitiesAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="functionForm"
          fieldname="dependsOnSystems"
          entities={systems.value || []}
        />
      </div>
      <div>
        <MultipleEntitiesAutocomplete
          index={index}
          control={control}
          errors={errors}
          formname="functionForm"
          fieldname="dependsOnFunctions"
          entities={functions.value || []}
        />
      </div>
      <TagField index={index} control={control} errors={errors} options={[]} />
      <FieldHeader
        fieldName={t('form.functionForm.links.fieldName')}
        tooltipText={t('form.functionForm.links.tooltipText')}
      />
      {links.map((link, linkIndex) => {
        return (
          <div key={link.id}>
            <LinkCard
              index={index}
              linkIndex={linkIndex}
              control={control}
              errors={errors}
              removeLink={removeLink}
            />
          </div>
        );
      })}
      <Button
        variant="secondary"
        onClick={() => appendLink({ url: '', title: '' })}
      >
        Ny lenke
      </Button>
    </Flex>
  );
};

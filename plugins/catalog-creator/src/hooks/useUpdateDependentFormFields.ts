import { Entity } from '@backstage/catalog-model';
import { useEffect } from 'react';
import { FieldPath, UseFormSetValue } from 'react-hook-form';
import z from 'zod/v4';
import { formSchema } from '../schemas/formSchema';

export const useUpdateDependentFormFields = (
  options: Entity[],
  valueToWatch: string[] | undefined,
  fieldPath: FieldPath<z.infer<typeof formSchema>>,
  setValue: UseFormSetValue<z.infer<typeof formSchema>>,
) => {
  const formatEntityString = (entity: Entity): string => {
    return `${entity.kind.toLowerCase()}:${entity.metadata.namespace?.toLowerCase() ?? 'default'}/${entity.metadata.name}`;
  };

  useEffect(() => {
    if (
      valueToWatch &&
      valueToWatch.length > 0 &&
      valueToWatch[0] !== '' &&
      options.length > 0
    ) {
      const intersection = options.flatMap(value => {
        if (valueToWatch.includes(value.metadata.name)) {
          return value.metadata.name;
        }
        if (valueToWatch.includes(formatEntityString(value))) {
          return formatEntityString(value);
        }
        return [];
      });
      const elementsToDelete = [
        ...valueToWatch.filter(e => !intersection.includes(e)),
      ];
      if (elementsToDelete.length > 0) {
        if (
          valueToWatch.length === 1 &&
          intersection.includes(valueToWatch[0])
        ) {
          setValue(fieldPath, valueToWatch[0]);
        } else {
          setValue(fieldPath, [
            ...valueToWatch.filter(e => intersection.includes(e)),
          ]);
        }
      }
    }
  }, [valueToWatch, options, fieldPath, setValue]);
};

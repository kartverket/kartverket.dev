import { FormType, RegelrettForm } from '../types';

export const filterContextsWithProvisionedFormTypes = (
  contexts: RegelrettForm[],
  formTypes: FormType[],
): RegelrettForm[] => {
  const provisionedFormIds = new Set(formTypes.map(formType => formType.id));
  return contexts.filter(context => provisionedFormIds.has(context.formId));
};

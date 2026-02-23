import { useState } from 'react';
import { LinksGridList } from './LinksGridList';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { functionLinkCardTranslationRef } from '../FunctionLinksCard/translation';
import { FORM_TYPE_MAP } from '../../constants';
import { RegelrettForm } from '../../types';
import { CreateFormSection } from './CreateFormSection';
import { Entity } from '@backstage/catalog-model';

interface FunctionFormsTabContentProps {
  forms: RegelrettForm[];
  regelrettBaseUrl: string;
  teamId: string;
  functionEntities: Entity[];
  onFormCreated: () => void;
}

export function FunctionFormsTabContent({
  forms,
  regelrettBaseUrl,
  teamId,
  functionEntities,
  onFormCreated,
}: FunctionFormsTabContentProps) {
  const { t } = useTranslationRef(functionLinkCardTranslationRef);
  const getFormType = (formId: string) => FORM_TYPE_MAP[formId] || 'Unknown';

  const [selectedFunction, setSelectedFunction] = useState('');

  const formsForSelectedFunction = forms.filter(
    f => f.name === selectedFunction,
  );
  const availableFormOptions = Object.entries(FORM_TYPE_MAP)
    .filter(
      ([formId]) => !formsForSelectedFunction.some(f => f.formId === formId),
    )
    .map(([formId, formName]) => ({ value: formId, label: formName }));

  const functionOptions = functionEntities.map(e => ({
    value: e.metadata.title ?? e.metadata.name,
    label: e.metadata.title ?? e.metadata.name,
  }));

  return (
    <>
      {forms.length === 0 ? (
        <p>{t('groupFormCard.noFunctionForms')}</p>
      ) : (
        <LinksGridList
          cols={1}
          items={forms.map(form => ({
            text: `${form.name} – ${getFormType(form.formId)}`,
            href: `${regelrettBaseUrl}/context/${form.id}`,
          }))}
        />
      )}

      {functionEntities.length > 0 && (
        <CreateFormSection
          formTypeOptions={availableFormOptions}
          secondarySelect={{
            placeholder: t('groupFormCard.selectFunction'),
            options: functionOptions,
            onChange: setSelectedFunction,
          }}
          onBuildMutationParams={(formId, functionName) =>
            formId && functionName && teamId
              ? { functionName, formId, teamId }
              : undefined
          }
          onSuccess={onFormCreated}
        />
      )}
    </>
  );
}

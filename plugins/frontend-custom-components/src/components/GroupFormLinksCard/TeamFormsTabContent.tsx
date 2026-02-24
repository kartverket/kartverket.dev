import { LinksGridList } from './LinksGridList';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { functionLinkCardTranslationRef } from '../FunctionLinksCard/translation';
import { FORM_TYPE_MAP } from '../../constants';
import { RegelrettForm } from '../../types';
import { CreateFormSection } from './CreateFormSection';

interface TeamFormsTabContentProps {
  forms: RegelrettForm[];
  regelrettBaseUrl: string;
  teamId: string;
  teamName: string;
  onFormCreated: () => void;
}

export function TeamFormsTabContent({
  forms,
  regelrettBaseUrl,
  teamId,
  teamName,
  onFormCreated,
}: TeamFormsTabContentProps) {
  const { t } = useTranslationRef(functionLinkCardTranslationRef);
  const getFormType = (formId: string) => FORM_TYPE_MAP[formId] || 'Unknown';

  const existingFormIds = new Set(forms.map(f => f.formId));
  const availableFormOptions = Object.entries(FORM_TYPE_MAP)
    .filter(([formId]) => !existingFormIds.has(formId))
    .map(([formId, formName]) => ({ value: formId, label: formName }));

  return (
    <>
      {forms.length === 0 ? (
        <p>{t('groupFormCard.noTeamForms')}</p>
      ) : (
        <LinksGridList
          cols={1}
          items={forms.map(form => ({
            text: `${form.name} – ${getFormType(form.formId)}`,
            href: `${regelrettBaseUrl}/context/${form.id}`,
          }))}
        />
      )}

      {availableFormOptions.length > 0 && (
        <CreateFormSection
          formTypeOptions={availableFormOptions}
          onBuildMutationParams={formId =>
            teamId ? { functionName: teamName, formId, teamId } : undefined
          }
          onSuccess={onFormCreated}
        />
      )}
    </>
  );
}

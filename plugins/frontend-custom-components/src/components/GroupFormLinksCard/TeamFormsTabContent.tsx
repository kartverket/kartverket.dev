import { styled } from '@mui/material/styles';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Link } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { functionLinkCardTranslationRef } from '../FunctionLinksCard/translation';
import { FORM_TYPE_MAP } from '../../constants';
import { buildFormUrl } from '../../utils/formUrl';
import { RegelrettForm } from '../../types';
import { CreateFormSection } from './CreateFormSection';

const FormList = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

const FormRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.04)'
      : 'rgba(0, 0, 0, 0.03)',
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.06)',
  },
}));

const StyledFormIcon = styled(DescriptionOutlinedIcon)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '1.2rem',
}));

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
        <FormList>
          {forms.map(form => (
            <FormRow key={form.id}>
              <StyledFormIcon />
              <Link
                to={buildFormUrl(regelrettBaseUrl, form.id)}
                target="_blank"
                rel="noopener"
              >
                {`${form.name} – ${getFormType(form.formId)}`}
              </Link>
            </FormRow>
          ))}
        </FormList>
      )}

      {availableFormOptions.length > 0 && (
        <CreateFormSection
          formTypeOptions={availableFormOptions}
          createButtonLabel={t('groupFormCard.createNewTeamForm')}
          onBuildMutationParams={formId =>
            teamId ? { functionName: teamName, formId, teamId } : undefined
          }
          onSuccess={onFormCreated}
        />
      )}
    </>
  );
}

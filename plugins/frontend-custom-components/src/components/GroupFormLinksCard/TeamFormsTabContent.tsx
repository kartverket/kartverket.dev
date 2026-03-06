import { makeStyles } from '@material-ui/core/styles';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { Link } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { functionLinkCardTranslationRef } from '../FunctionLinksCard/translation';
import { buildFormUrl } from '../../utils/formUrl';
import { RegelrettForm } from '../../types';
import { CreateFormSection } from './CreateFormSection';

const useStyles = makeStyles(theme => ({
  formList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  formRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor:
      theme.palette.type === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(0, 0, 0, 0.03)',
    transition: 'background-color 0.15s ease',
    '&:hover': {
      backgroundColor:
        theme.palette.type === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.06)',
    },
  },
  formIcon: {
    color: theme.palette.text.secondary,
    fontSize: '1.2rem',
  },
}));

interface TeamFormsTabContentProps {
  forms: RegelrettForm[];
  regelrettBaseUrl: string;
  teamId: string;
  teamName: string;
  onFormCreated: () => void;
  formTypeMap: Record<string, string>;
}

export function TeamFormsTabContent({
  forms,
  regelrettBaseUrl,
  teamId,
  teamName,
  onFormCreated,
  formTypeMap,
}: TeamFormsTabContentProps) {
  const classes = useStyles();
  const { t } = useTranslationRef(functionLinkCardTranslationRef);
  const getFormType = (formId: string) => formTypeMap[formId] || 'Unknown';

  const existingFormIds = new Set(forms.map(f => f.formId));
  const availableFormOptions = Object.entries(formTypeMap)
    .filter(([formId]) => !existingFormIds.has(formId))
    .map(([formId, formName]) => ({ value: formId, label: formName }));

  return (
    <>
      {forms.length === 0 ? (
        <p>{t('groupFormCard.noTeamForms')}</p>
      ) : (
        <div className={classes.formList}>
          {forms.map(form => (
            <div key={form.id} className={classes.formRow}>
              <DescriptionOutlinedIcon className={classes.formIcon} />
              <Link
                to={buildFormUrl(regelrettBaseUrl, form.id)}
                target="_blank"
                rel="noopener"
              >
                {`${form.name} – ${getFormType(form.formId)}`}
              </Link>
            </div>
          ))}
        </div>
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

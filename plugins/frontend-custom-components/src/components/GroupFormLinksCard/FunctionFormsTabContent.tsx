import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import LayersIcon from '@material-ui/icons/Layers';
import { Link } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { functionLinkCardTranslationRef } from '../FunctionLinksCard/translation';
import { FORM_TYPE_MAP } from '../../constants';
import { buildFormUrl } from '../../utils/formUrl';
import { RegelrettForm } from '../../types';
import { CreateFormSection } from './CreateFormSection';
import { Entity } from '@backstage/catalog-model';

const useStyles = makeStyles(theme => ({
  scrollContainer: {
    maxHeight: 400,
    overflowY: 'auto',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: `${theme.spacing(1)}px 0`,
    marginTop: theme.spacing(1),
    '&:first-child': {
      marginTop: 0,
    },
  },
  sectionIcon: {
    color: theme.palette.text.secondary,
    fontSize: '1.2rem',
  },
  sectionName: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: theme.palette.text.primary,
  },
  sectionBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 20,
    height: 20,
    padding: '0 6px',
    borderRadius: 10,
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor:
      theme.palette.type === 'dark'
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.08)',
    color: theme.palette.text.secondary,
  },
  formList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
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
  metricsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginLeft: 'auto',
  },
  metricsLabel: {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap' as const,
  },
  expiredWarning: {
    gap: theme.spacing(0.5),
    fontSize: '0.8rem',
    color: theme.palette.error.main,
    whiteSpace: 'nowrap' as const,
  },
  expiredIcon: {
    fontSize: '1rem',
    color: theme.palette.error.main,
  },
}));

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
  const classes = useStyles();
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

  const formsByFunction = forms.reduce(
    (acc: Record<string, RegelrettForm[]>, form) => {
      if (!acc[form.name]) acc[form.name] = [];
      acc[form.name].push(form);
      return acc;
    },
    {},
  );

  return (
    <>
      {forms.length === 0 ? (
        <p>{t('groupFormCard.noFunctionForms')}</p>
      ) : (
        <div className={classes.scrollContainer}>
          {Object.entries(formsByFunction).map(([funcName, funcForms]) => (
            <div key={funcName}>
              <div className={classes.sectionHeader}>
                <LayersIcon className={classes.sectionIcon} />
                <span className={classes.sectionName}>{funcName}</span>
                <span className={classes.sectionBadge}>{funcForms.length}</span>
              </div>
              <div className={classes.formList}>
                {funcForms.map(form => (
                  <div key={form.id} className={classes.formRow}>
                    <DescriptionOutlinedIcon className={classes.formIcon} />
                    <Link
                      to={buildFormUrl(regelrettBaseUrl, form.id)}
                      target="_blank"
                      rel="noopener"
                    >
                      {getFormType(form.formId)}
                    </Link>
                    <div className={classes.metricsContainer}>
                      <span className={classes.metricsLabel}>
                        {t('formMetrics.answered', {
                          answered: String(form.answeredCount),
                          total: String(form.totalCount),
                        })}
                      </span>
                      {form.expiredCount > 0 && (
                        <span className={classes.expiredWarning}>
                          <WarningAmberOutlined
                            className={classes.expiredIcon}
                            sx={{ verticalAlign: 'middle' }}
                          />
                          {t('formMetrics.expired', {
                            expired: String(form.expiredCount),
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {functionEntities.length > 0 && (
        <CreateFormSection
          formTypeOptions={availableFormOptions}
          createButtonLabel={t('groupFormCard.createNewFunctionForm')}
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

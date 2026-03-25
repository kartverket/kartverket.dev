import { useState } from 'react';
import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import { InfoCard, Progress } from '@backstage/core-components';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { useTeamRegelrettQuery } from '../../hooks/useTeamRegelrettQuery';
import { useFormTypesQuery } from '../../hooks/useFormTypesQuery';
import { useIsGroupMember } from '../../hooks/useIsGroupMember';
import Alert from '@mui/material/Alert';
import { configApiRef, useApi } from '@backstage/frontend-plugin-api';
import { makeStyles } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { functionLinkCardTranslationRef } from '../FunctionSecurityFormsCard/translation';
import { TeamFormsTabContent } from './TeamFormsTabContent';
import { FunctionFormsTabContent } from './FunctionFormsTabContent';
import { isUnauthorizedError } from '../../errors';

const useStyles = makeStyles(theme => ({
  tabContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  tab: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    borderRadius: 20,
    border: 'none',
    cursor: 'pointer',
    fontSize: 'var(--bui-font-size-3)',
    fontWeight: 500,
    fontFamily: theme.typography.fontFamily,
    transition: 'all 0.2s ease',
    '&:hover': {
      opacity: 0.85,
    },
  },
  activeTab: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  inactiveTab: {
    backgroundColor:
      theme.palette.type === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.06)',
    color: theme.palette.text.secondary,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 20,
    height: 20,
    padding: '0 6px',
    borderRadius: 10,
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1,
  },
  activeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    color: theme.palette.primary.contrastText,
  },
  inactiveBadge: {
    backgroundColor:
      theme.palette.type === 'dark'
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.1)',
    color: theme.palette.text.secondary,
  },
  icon: {
    fontSize: '1.1rem',
  },
}));

const queryClient = new QueryClient();

export const GroupSecurityFormsCard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GroupSecurityFormsCardWrapper />
    </QueryClientProvider>
  );
};

function GroupSecurityFormsCardWrapper() {
  const classes = useStyles();
  const { t } = useTranslationRef(functionLinkCardTranslationRef);
  const config = useApi(configApiRef);
  const catalogApi = useApi(catalogApiRef);
  const { entity } = useEntity();
  const regelrettBaseUrl = config.getString(`regelrett.url`);

  const teamId =
    entity.metadata.annotations?.['graph.microsoft.com/group-id'] ?? '';
  const teamName = entity.metadata.title ?? entity.metadata.name;

  const groupRef = `${entity.kind}:${entity.metadata.namespace ?? 'default'}/${entity.metadata.name}`;

  const { isMember, isLoading: isMembershipLoading } =
    useIsGroupMember(groupRef);

  const isReady = !isMembershipLoading && isMember;

  const { data, isLoading, error, refetch } = useTeamRegelrettQuery(entity, {
    enabled: isReady,
  });

  const {
    data: formTypes,
    isLoading: isFormTypesLoading,
    error: formTypesError,
  } = useFormTypesQuery();

  const formTypeMap: Record<string, string> = Object.fromEntries(
    (formTypes ?? []).map(f => [f.id, f.name]),
  );

  const { data: functionEntities, isLoading: isFunctionEntitiesLoading } =
    useQuery({
      queryKey: ['functionEntities', groupRef],
      enabled: isReady,
      queryFn: () =>
        catalogApi.getEntities({
          filter: {
            kind: 'Function',
            'relations.ownedBy': groupRef.toLowerCase(),
          },
        }),
    });

  const functionNames =
    functionEntities?.items.map(
      item => item.metadata.title ?? item.metadata.name,
    ) ?? [];

  const teamForms = (data ?? []).filter(
    item => !functionNames.includes(item.name),
  );

  const functionForms = (data ?? []).filter(item =>
    functionNames.includes(item.name),
  );

  const [activeTab, setActiveTab] = useState<'team' | 'functions'>('team');

  const renderContent = () => {
    if (isMembershipLoading) {
      return <Progress />;
    }
    if (!isMember) {
      return (
        <Alert severity="info">{t('groupFormCard.fetchUnauthorized')}</Alert>
      );
    }
    if (isLoading || isFunctionEntitiesLoading || isFormTypesLoading) {
      return <Progress />;
    }
    if (error || formTypesError) {
      const isUnauthorized = isUnauthorizedError(error);
      return (
        <Alert severity={isUnauthorized ? 'info' : 'error'}>
          {isUnauthorized
            ? t('groupFormCard.fetchUnauthorized')
            : t('groupFormCard.fetchError')}
        </Alert>
      );
    }
    return (
      <>
        <div className={classes.tabContainer}>
          <button
            type="button"
            className={`${classes.tab} ${activeTab === 'team' ? classes.activeTab : classes.inactiveTab}`}
            onClick={() => setActiveTab('team')}
          >
            <PeopleIcon className={classes.icon} />
            {t('groupFormCard.teamTab')}
            <span
              className={`${classes.badge} ${activeTab === 'team' ? classes.activeBadge : classes.inactiveBadge}`}
            >
              {teamForms.length}
            </span>
          </button>
          <button
            type="button"
            className={`${classes.tab} ${activeTab === 'functions' ? classes.activeTab : classes.inactiveTab}`}
            onClick={() => setActiveTab('functions')}
          >
            <AccountTreeIcon className={classes.icon} />
            {t('groupFormCard.functionsTab')}
            <span
              className={`${classes.badge} ${activeTab === 'functions' ? classes.activeBadge : classes.inactiveBadge}`}
            >
              {functionForms.length}
            </span>
          </button>
        </div>
        {activeTab === 'team' ? (
          <TeamFormsTabContent
            forms={teamForms}
            regelrettBaseUrl={regelrettBaseUrl}
            teamId={teamId}
            teamName={teamName}
            onFormCreated={refetch}
            formTypeMap={formTypeMap}
          />
        ) : (
          <FunctionFormsTabContent
            forms={functionForms}
            regelrettBaseUrl={regelrettBaseUrl}
            teamId={teamId}
            functionEntities={functionEntities?.items ?? []}
            onFormCreated={refetch}
            formTypeMap={formTypeMap}
          />
        )}
      </>
    );
  };

  return (
    <InfoCard title={t('groupFormCard.title')}>{renderContent()}</InfoCard>
  );
}

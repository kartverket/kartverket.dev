import { useState } from 'react';
import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import { InfoCard, Progress } from '@backstage/core-components';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { useTeamRegelrettQuery } from '../../hooks/useTeamRegelrettQuery';
import { useIsGroupMember } from '../../hooks/useIsGroupMember';
import Alert from '@mui/material/Alert';
import { configApiRef, useApi } from '@backstage/frontend-plugin-api';
import { styled } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import LayersIcon from '@mui/icons-material/Layers';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { functionLinkCardTranslationRef } from '../FunctionLinksCard/translation';
import { TeamFormsTabContent } from './TeamFormsTabContent';
import { FunctionFormsTabContent } from './FunctionFormsTabContent';
import { isUnauthorizedError } from '../../errors';

const TabContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const Tab = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
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
}));

const ActiveTab = styled(Tab)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const InactiveTab = styled(Tab)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)',
  color: theme.palette.text.secondary,
}));

const TabBadge = styled('span')({
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
});

const ActiveBadge = styled(TabBadge)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.25)',
  color: theme.palette.primary.contrastText,
}));

const InactiveBadge = styled(TabBadge)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(0, 0, 0, 0.1)',
  color: theme.palette.text.secondary,
}));

const StyledPeopleIcon = styled(PeopleIcon)({ fontSize: '1.1rem' });
const StyledLayersIcon = styled(LayersIcon)({ fontSize: '1.1rem' });

const queryClient = new QueryClient();

export const GroupFormLinksCard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GroupFormLinksCardWrapper />
    </QueryClientProvider>
  );
};

function GroupFormLinksCardWrapper() {
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
    if (isLoading || isFunctionEntitiesLoading) {
      return <Progress />;
    }
    if (error) {
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
        <TabContainer>
          {activeTab === 'team' ? (
            <ActiveTab type="button" onClick={() => setActiveTab('team')}>
              <StyledPeopleIcon />
              {t('groupFormCard.teamTab')}
              <ActiveBadge>{teamForms.length}</ActiveBadge>
            </ActiveTab>
          ) : (
            <InactiveTab type="button" onClick={() => setActiveTab('team')}>
              <StyledPeopleIcon />
              {t('groupFormCard.teamTab')}
              <InactiveBadge>{teamForms.length}</InactiveBadge>
            </InactiveTab>
          )}
          {activeTab === 'functions' ? (
            <ActiveTab type="button" onClick={() => setActiveTab('functions')}>
              <StyledLayersIcon />
              {t('groupFormCard.functionsTab')}
              <ActiveBadge>{functionForms.length}</ActiveBadge>
            </ActiveTab>
          ) : (
            <InactiveTab
              type="button"
              onClick={() => setActiveTab('functions')}
            >
              <StyledLayersIcon />
              {t('groupFormCard.functionsTab')}
              <InactiveBadge>{functionForms.length}</InactiveBadge>
            </InactiveTab>
          )}
        </TabContainer>
        {activeTab === 'team' ? (
          <TeamFormsTabContent
            forms={teamForms}
            regelrettBaseUrl={regelrettBaseUrl}
            teamId={teamId}
            teamName={teamName}
            onFormCreated={refetch}
          />
        ) : (
          <FunctionFormsTabContent
            forms={functionForms}
            regelrettBaseUrl={regelrettBaseUrl}
            teamId={teamId}
            functionEntities={functionEntities?.items ?? []}
            onFormCreated={refetch}
          />
        )}
      </>
    );
  };

  return (
    <InfoCard title={t('groupFormCard.title')}>{renderContent()}</InfoCard>
  );
}

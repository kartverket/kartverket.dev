import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import {
  InfoCard,
  Progress,
} from '@backstage/core-components';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { useTeamRegelrettQuery } from '../../hooks/useTeamRegelrettQuery';
import Alert from '@mui/material/Alert';
import { configApiRef, useApi } from '@backstage/frontend-plugin-api';
import { Tabs, TabList, Tab, TabPanel } from '@backstage/ui';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { functionLinkCardTranslationRef } from '../FunctionLinksCard/translation';
import { TeamFormsTabContent } from './TeamFormsTabContent';
import { FunctionFormsTabContent } from './FunctionFormsTabContent';

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

  const { data, isLoading, error, refetch } = useTeamRegelrettQuery(entity);

  const groupRef = `${entity.kind}:${entity.metadata.namespace ?? 'default'}/${entity.metadata.name}`;

  const {
    data: functionEntities,
    isLoading: isFunctionEntitiesLoading,
  } = useQuery({
    queryKey: ['functionEntities', groupRef],
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

  const renderContent = () => {
    if (isLoading || isFunctionEntitiesLoading) {
      return <Progress />;
    }
    if (error) {
      return <Alert severity="error">{t('groupFormCard.fetchError')}</Alert>;
    }
    return (
      <Tabs>
        <TabList>
          <Tab id="team-tab">{t('groupFormCard.teamTab', { teamName })}</Tab>
          <Tab id="functions-tab">{t('groupFormCard.functionsTab')}</Tab>
        </TabList>
        <TabPanel id="team-tab">
          <TeamFormsTabContent
            forms={teamForms}
            regelrettBaseUrl={regelrettBaseUrl}
            teamId={teamId}
            teamName={teamName}
            onFormCreated={refetch}
          />
        </TabPanel>
        <TabPanel id="functions-tab">
          <FunctionFormsTabContent
            forms={functionForms}
            regelrettBaseUrl={regelrettBaseUrl}
            teamId={teamId}
            functionEntities={functionEntities?.items ?? []}
            onFormCreated={refetch}
          />
        </TabPanel>
      </Tabs>
    );
  };

  return (
    <InfoCard title={t('groupFormCard.title')}>
      {renderContent()}
    </InfoCard>
  );
}

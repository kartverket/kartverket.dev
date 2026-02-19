import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import { LinksGridList } from './LinksGridList';
import { ColumnBreakpoints } from './types';
import {
  InfoCard,
  InfoCardVariants,
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
import { EmptyStateCard } from './EmptyStateCard';
import { RegelrettForm } from '../../types';
import { Tabs, TabList, Tab, TabPanel } from '@backstage/ui';

/** @public */
export interface EntityLinksCardProps {
  cols?: ColumnBreakpoints | number;
  variant?: InfoCardVariants;
}

const FORM_TYPE_MAP: Record<string, string> = {
  '816cc808-9188-44a9-8f4b-5642fc2932c4': 'Tjenestenivå og driftskontinuitet',
  '248f16c3-9c0e-4177-bf57-aa7d10d2671c': 'IP og DPIA (BETA – UNDER ARBEID)',
  '570e9285-3228-4396-b82b-e9752e23cd73': 'Sikkerhetskontrollere',
  'e3ab7a6c-c54e-4240-8314-45990e1d7cf1': 'Datasettvurdering',
};

const queryClient = new QueryClient();

export const GroupFormLinksCard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GroupFormLinksCardWrapper />
    </QueryClientProvider>
  );
};

function GroupFormLinksCardWrapper() {
  const config = useApi(configApiRef);
  const catalogApi = useApi(catalogApiRef);
  const { entity } = useEntity();
  const regelrettBaseUrl = config.getString(`regelrett.url`);

  const { data, isLoading, error } = useTeamRegelrettQuery(entity);

  const groupRef = `${entity.kind}:${entity.metadata.namespace ?? 'default'}/${entity.metadata.name}`;

  const { data: functionEntities } = useQuery({
    queryKey: ['functionEntities', groupRef],
    queryFn: () =>
      catalogApi.getEntities({
        filter: {
          kind: 'Function',
          'relations.ownedBy': groupRef.toLowerCase(),
        },
      }),
  });

  const formsToBeFiltered =
    functionEntities?.items.map(
      item => item.metadata.title ?? item.metadata.name,
    ) ?? [];

  const teamForms = (data ?? [])
    .filter(item => !formsToBeFiltered.includes(item.name))
    .reduce((acc: Record<string, RegelrettForm[]>, currentItem) => {
      const key = currentItem.formId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(currentItem);
      return acc;
    }, {});

  const functionForms = (data ?? []).filter(item =>
    formsToBeFiltered.includes(item.name),
  );

  return (
    <>
      <TeamFormsCard
        groupedData={teamForms}
        regelrettBaseUrl={regelrettBaseUrl}
        isLoading={isLoading}
        error={error}
      />
      <FunctionFormsCard
        forms={functionForms}
        regelrettBaseUrl={regelrettBaseUrl}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}

interface TeamFormsCardProps {
  groupedData: Record<string, RegelrettForm[]>;
  regelrettBaseUrl: string;
  isLoading: boolean;
  error: unknown;
}

function TeamFormsCard({
  groupedData,
  regelrettBaseUrl,
  isLoading,
  error,
}: TeamFormsCardProps) {
  const getFormType = (formId: string) => FORM_TYPE_MAP[formId] || 'Unknown';

  const showData = () => {
    if (error) {
      return (
        <Alert severity="error">Klarte ikke hente regelrett-skjemaer</Alert>
      );
    }
    if (Object.keys(groupedData).length === 0) {
      return <EmptyStateCard />;
    }
    return Object.entries(groupedData).map(([formId, forms]) => (
      <>
        <h3>{getFormType(formId)}</h3>
        <LinksGridList
          cols={1}
          items={forms.map(form => ({
            text: form.name,
            href: `${regelrettBaseUrl}/context/${form.id}`,
          }))}
        />
      </>
    ));
  };

  return (
    <InfoCard title="Sikkerhetsskjemaer">
      {isLoading ? <Progress /> : showData()}
    </InfoCard>
  );
}

interface FunctionFormsCardProps {
  forms: RegelrettForm[];
  regelrettBaseUrl: string;
  isLoading: boolean;
  error: unknown;
}

function FunctionFormsCard({
  forms,
  regelrettBaseUrl,
  isLoading,
  error,
}: FunctionFormsCardProps) {
  const showData = () => {
    if (error) {
      return (
        <Alert severity="error">Klarte ikke hente regelrett-skjemaer</Alert>
      );
    }
    if (forms.length === 0) {
      return <EmptyStateCard />;
    }
    return (
      <Tabs>
        <TabList>
          <Tab id="tab1">SKVIS</Tab>
          <Tab id="tab2">Funksjoner til SKVIS</Tab>
        </TabList>
        <TabPanel id="tab1">Content 1</TabPanel>
        <TabPanel id="tab2">Content 2</TabPanel>
      </Tabs>
    );
  };

  return (
    <InfoCard title="Funksjonsskjemaer">
      {isLoading ? <Progress /> : showData()}
    </InfoCard>
  );
}

import { useEntity } from '@backstage/plugin-catalog-react';
import { LinksGridList } from './LinksGridList';
import { ColumnBreakpoints } from './types';
import {
  InfoCard,
  InfoCardVariants,
  Progress,
} from '@backstage/core-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTeamRegelrettQuery } from '../../hooks/useTeamRegelrettQuery';
import Alert from '@mui/material/Alert';
import { configApiRef, useApi } from '@backstage/frontend-plugin-api';
import { EmptyStateCard } from './EmptyStateCard';
import { RegelrettForm } from '../../types';

/** @public */
export interface EntityLinksCardProps {
  cols?: ColumnBreakpoints | number;
  variant?: InfoCardVariants;
}

const queryClient = new QueryClient();

export const GroupFormLinksCard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GroupFormLinksCardItem />
    </QueryClientProvider>
  );
};

function GroupFormLinksCardItem(props: EntityLinksCardProps) {
  const { variant } = props;
  const config = useApi(configApiRef);
  const { entity } = useEntity();
  const { data, isLoading, error } = useTeamRegelrettQuery(entity);
  const regelrettBaseUrl = config.getString(`regelrett.url`);

  const FORM_TYPE_MAP: Record<string, string> = {
    '816cc808-9188-44a9-8f4b-5642fc2932c4': 'Tjenestenivå og driftskontinuitet',
    '248f16c3-9c0e-4177-bf57-aa7d10d2671c': 'IP og DPIA (BETA – UNDER ARBEID)',
    '570e9285-3228-4396-b82b-e9752e23cd73': 'Sikkerhetskontrollere',
    'e3ab7a6c-c54e-4240-8314-45990e1d7cf1': 'Datasettvurdering',
  };

  const getGroupedData = (
    dataToGroup: RegelrettForm[],
  ): Record<string, RegelrettForm[]> => {
    return dataToGroup.reduce(
      (
        accumulator: Record<string, RegelrettForm[]>,
        currentItem: RegelrettForm,
      ) => {
        const key = currentItem.formId;
        if (!accumulator[key]) {
          accumulator[key] = [];
        }
        accumulator[key].push(currentItem);
        return accumulator;
      },
      {} as Record<string, RegelrettForm[]>,
    );
  };

  const getFormType = (formId: string): string => {
    return FORM_TYPE_MAP[formId] || 'Unknown';
  };

  const showData = () => {
    if (data && data.length !== 0 && !error && true) {
      const groupedData = getGroupedData(data);
      return Object.entries(groupedData).map(([formId, forms]) => {
        return (
          <>
            <h3>{getFormType(formId)}</h3>
            <LinksGridList
              cols={1}
              items={forms.map(form => ({
                text: `${form.name}`,
                href: `${regelrettBaseUrl}/context/${form.id}`,
              }))}
            />
          </>
        );
      });
    } else if (error) {
      return (
        <Alert severity="error"> Klarte ikke hente regelrett-skjemaer</Alert>
      );
    }
    return <EmptyStateCard />;
  };
  return (
    <InfoCard title="Regelrett Forms" variant={variant}>
      {isLoading ? <Progress /> : showData()}
    </InfoCard>
  );
}

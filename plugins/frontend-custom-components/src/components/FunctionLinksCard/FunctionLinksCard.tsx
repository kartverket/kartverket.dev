/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEntity } from '@backstage/plugin-catalog-react';
import { EntityLinksEmptyState } from './FunctionLinksEmptyState';
import { LinksGridList } from './LinksGridList';
import { ColumnBreakpoints } from './types';
import {
  InfoCard,
  InfoCardVariants,
  Progress,
} from '@backstage/core-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRegelrettQuery } from '../../hooks/useRegelrettQuery';
import Alert from '@mui/material/Alert';
import { configApiRef, useApi } from '@backstage/frontend-plugin-api';

/** @public */
export interface EntityLinksCardProps {
  cols?: ColumnBreakpoints | number;
  variant?: InfoCardVariants;
}

const queryClient = new QueryClient();

export const FunctionLinksCard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FunctionLinksCardItem />
    </QueryClientProvider>
  );
};

function FunctionLinksCardItem(props: EntityLinksCardProps) {
  const { cols = undefined, variant } = props;
  const config = useApi(configApiRef);
  const { entity } = useEntity();
  const { data, isLoading, error } = useRegelrettQuery(entity.metadata.name);
  const regelrettBaseUrl = config.getString(`regelrett.baseUrl`);

  const FORM_TYPE_MAP: Record<string, string> = {
    '816cc808-9188-44a9-8f4b-5642fc2932c4': 'Tjenestenivå og driftskontinuitet',
    '248f16c3-9c0e-4177-bf57-aa7d10d2671c': 'IP og DPIA (BETA – UNDER ARBEID)',
    '570e9285-3228-4396-b82b-e9752e23cd73': 'Sikkerhetskontrollere',
    'e3ab7a6c-c54e-4240-8314-45990e1d7cf1': 'Datasettvurdering',
  };

  const getFormType = (formId: string): string => {
    return FORM_TYPE_MAP[formId] || 'Unknown';
  };

  const showData = () => {
    if (data && data.length !== 0 && !error) {
      return (
        <LinksGridList
          cols={cols}
          items={data.map(({ formId }) => ({
            text: getFormType(formId),
            href: `${regelrettBaseUrl}/context/${formId}`,
          }))}
        />
      );
    } else if (error) {
      return (
        <Alert severity="error"> Klarte ikke hente regelrett-skjemaer</Alert>
      );
    }
    return <EntityLinksEmptyState />;
  };
  return (
    <InfoCard title="Regelrett Forms" variant={variant}>
      {isLoading ? <Progress /> : showData()}
    </InfoCard>
  );
}

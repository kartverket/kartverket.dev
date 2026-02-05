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
import { LinksGridList } from './LinksGridList';
import { ColumnBreakpoints } from './types';
import {
  InfoCard,
  InfoCardVariants,
  Progress,
} from '@backstage/core-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRegelrettQuery } from '../../hooks/useRegelrettQuery';
import { useRegelrettCreateContextMutation } from '../../hooks/useRegelrettCreateContextMutation';
import Alert from '@mui/material/Alert';
import { Divider } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { configApiRef, useApi } from '@backstage/frontend-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Button, Flex, Select } from '@backstage/ui';

/** @public */
export interface EntityLinksCardProps {
  cols?: ColumnBreakpoints | number;
  variant?: InfoCardVariants;
}

const queryClient = new QueryClient();

const FORM_TYPE_MAP: Record<string, string> = {
  '816cc808-9188-44a9-8f4b-5642fc2932c4': 'Tjenestenivå og driftskontinuitet',
  'e3ab7a6c-c54e-4240-8314-45990e1d7cf1': 'Datasettvurdering',
};

export const FunctionLinksCard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FunctionLinksCardItem />
    </QueryClientProvider>
  );
};

function FunctionLinksCardItem(props: EntityLinksCardProps) {
  const { cols = 1, variant } = props;
  const config = useApi(configApiRef);
  const catalogApi = useApi(catalogApiRef);
  const { entity } = useEntity();
  const functionName = entity.metadata.name;
  const regelrettBaseUrl = config.getString(`regelrett.baseUrl`);

  const [teamId, setTeamId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const {
    mutate,
    isPending: isCreating,
    error: createError,
  } = useRegelrettCreateContextMutation();

  useEffect(() => {
    const fetchOwner = async () => {
      const ownerRelation = entity.relations?.find(
        rel => rel.type === 'ownedBy',
      );
      if (!ownerRelation) return;

      const { items } = await catalogApi.getEntitiesByRefs({
        entityRefs: [ownerRelation.targetRef],
      });

      if (items[0]) {
        setTeamId(
          items[0].metadata.annotations?.['graph.microsoft.com/group-id'] || '',
        );
      }
    };
    fetchOwner();
  }, [entity, catalogApi]);

  const { data, isLoading, error, refetch } = useRegelrettQuery(functionName);

  const [selectedFormId, setSelectedFormId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted && !isCreating && !createError) {
      refetch();
      setSubmitted(false);
      setSelectedFormId('');
      setShowCreateForm(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    }
  }, [submitted, isCreating, createError, refetch]);

  const getFormType = (formId: string): string => {
    return FORM_TYPE_MAP[formId] || 'Unknown';
  };

  const handleSubmit = () => {
    if (!selectedFormId || !teamId) return;
    setSubmitted(true);
    mutate({ functionName, formId: selectedFormId, teamId });
  };

  const availableFormsExist = Object.keys(FORM_TYPE_MAP).some(
    formId => !data?.some(form => form.formId === formId),
  );

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
      return <Alert severity="error">Could not fetch regelrett forms</Alert>;
    }
    return <p>No regelrett forms created yet</p>;
  };

  return (
    <InfoCard title="Regelrett Forms" variant={variant}>
      {isLoading && <Progress />}

      {!isLoading && showData()}

      {showSuccessMessage && (
        <Alert severity="success" style={{ margin: '1rem' }}>
          Form was created
        </Alert>
      )}

      {availableFormsExist && (
        <>
          <Divider style={{ margin: '1rem' }} />

          {!showCreateForm && (
            <Button onClick={() => setShowCreateForm(true)}>
              Create new form
            </Button>
          )}

          {showCreateForm && (
            <Flex style={{ marginTop: '5px', gap: '8px' }}>
              <Select
                style={{ flex: 1, minWidth: 0 }}
                placeholder="Velg skjema"
                value={selectedFormId}
                isDisabled={isCreating}
                options={Object.entries(FORM_TYPE_MAP)
                  .filter(
                    ([formId]) => !data?.some(form => form.formId === formId),
                  )
                  .map(([formId, formName]) => ({
                    value: formId,
                    label: formName,
                  }))}
                onChange={key => setSelectedFormId(key as string)}
              />

              <Button
                variant="primary"
                isDisabled={!selectedFormId || !teamId || isCreating}
                onClick={handleSubmit}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </Button>

              <Button
                variant="secondary"
                isDisabled={isCreating}
                onClick={() => {
                  setShowCreateForm(false);
                  setSelectedFormId('');
                }}
              >
                Cancel
              </Button>
            </Flex>
          )}

          {isCreating && <Progress />}

          {createError && (
            <Alert severity="error" style={{ margin: '1rem 0 0' }}>
              Could not create form
            </Alert>
          )}
        </>
      )}
    </InfoCard>
  );
}

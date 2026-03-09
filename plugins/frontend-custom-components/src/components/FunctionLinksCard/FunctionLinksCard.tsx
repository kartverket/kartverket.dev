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
import { ColumnBreakpoints } from './types';
import {
  InfoCard,
  InfoCardVariants,
  Progress,
  Link,
} from '@backstage/core-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRegelrettQuery } from '../../hooks/useRegelrettQuery';
import { useRegelrettCreateContextMutation } from '../../hooks/useRegelrettCreateContextMutation';
import { useIsGroupMember } from '../../hooks/useIsGroupMember';
import Alert from '@mui/material/Alert';
import { makeStyles } from 'tss-react/mui';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useState, useEffect } from 'react';
import { configApiRef, useApi } from '@backstage/frontend-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Button, Flex } from '@backstage/ui';
import FormControl from '@mui/material/FormControl';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { functionLinkCardTranslationRef } from './translation';
import { FORM_TYPE_MAP } from '../../constants';
import { buildFormUrl } from '../../utils/formUrl';
import Typography from '@mui/material/Typography';
import { isUnauthorizedError } from '../../errors';

const useStyles = makeStyles()(theme => ({
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
  },
  formIcon: {
    color: theme.palette.text.secondary,
    fontSize: '1.2rem',
  },
}));

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
  const { variant } = props;
  const { classes } = useStyles();
  const { t } = useTranslationRef(functionLinkCardTranslationRef);
  const config = useApi(configApiRef);
  const catalogApi = useApi(catalogApiRef);
  const { entity } = useEntity();
  const functionName = entity.metadata.title || entity.metadata.name;
  const regelrettBaseUrl = config.getString(`regelrett.url`);

  const ownerRef = entity.relations?.find(
    rel => rel.type === 'ownedBy',
  )?.targetRef;
  const { isMember, isLoading: isMembershipLoading } =
    useIsGroupMember(ownerRef);

  const isReady = !isMembershipLoading && isMember;

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

  const { data, isLoading, error, refetch } = useRegelrettQuery(functionName, {
    enabled: isReady,
  });

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
        <div className={classes.formList}>
          {data.map(({ id, formId }) => (
            <div key={id} className={classes.formRow}>
              <DescriptionOutlinedIcon className={classes.formIcon} />
              <Link
                to={buildFormUrl(regelrettBaseUrl, id)}
                target="_blank"
                rel="noopener"
              >
                {getFormType(formId)}
              </Link>
            </div>
          ))}
        </div>
      );
    } else if (error) {
      const isUnauthorized = isUnauthorizedError(error);
      return (
        <Alert severity={isUnauthorized ? 'info' : 'error'}>
          {isUnauthorized
            ? t('functionLinkCard.fetchUnauthorized')
            : t('functionLinkCard.fetchError')}
        </Alert>
      );
    }
    return <p>{t('functionLinkCard.noFormsYet')}</p>;
  };

  return (
    <InfoCard
      title={t('functionLinkCard.title')}
      subheader={
        <Typography variant="subtitle1">
          {t('functionLinkCard.subtitle')}
        </Typography>
      }
      variant={variant}
    >
      {(isMembershipLoading || (isMember && isLoading)) && <Progress />}
      {!isMembershipLoading && !isMember && (
        <Alert severity="info">{t('functionLinkCard.fetchUnauthorized')}</Alert>
      )}

      {isMember && !isLoading && showData()}

      {showSuccessMessage && (
        <Alert severity="success" style={{ margin: '1rem' }}>
          {t('functionLinkCard.formCreatedSuccess')}
        </Alert>
      )}

      {isMember &&
        !isLoading &&
        availableFormsExist &&
        !isUnauthorizedError(error) && (
          <div style={{ marginTop: '1rem' }}>
            {!showCreateForm && (
              <Button onClick={() => setShowCreateForm(true)}>
                {t('functionLinkCard.createNewForm')}
              </Button>
            )}

            {showCreateForm && (
              <Flex style={{ marginTop: '5px', gap: '8px' }}>
                <FormControl size="small" style={{ flex: 1, minWidth: 0 }}>
                  <MuiSelect
                    displayEmpty
                    value={selectedFormId}
                    disabled={isCreating}
                    sx={{ fontSize: 'var(--bui-font-size-3)' }}
                    onChange={(e: SelectChangeEvent<string>) =>
                      setSelectedFormId(e.target.value)
                    }
                  >
                    <MenuItem
                      value=""
                      disabled
                      sx={{ fontSize: 'var(--bui-font-size-3)' }}
                    >
                      <span style={{ color: 'inherit', opacity: 0.5 }}>
                        {t('functionLinkCard.selectForm')}
                      </span>
                    </MenuItem>
                    {Object.entries(FORM_TYPE_MAP)
                      .filter(
                        ([formId]) =>
                          !data?.some(form => form.formId === formId),
                      )
                      .map(([formId, formName]) => (
                        <MenuItem
                          key={formId}
                          value={formId}
                          sx={{ fontSize: 'var(--bui-font-size-3)' }}
                        >
                          {formName}
                        </MenuItem>
                      ))}
                  </MuiSelect>
                </FormControl>

                <Button
                  variant="primary"
                  isDisabled={!selectedFormId || !teamId || isCreating}
                  onClick={handleSubmit}
                >
                  {isCreating
                    ? t('functionLinkCard.creating')
                    : t('functionLinkCard.create')}
                </Button>

                <Button
                  variant="secondary"
                  isDisabled={isCreating}
                  onClick={() => {
                    setShowCreateForm(false);
                    setSelectedFormId('');
                  }}
                >
                  {t('functionLinkCard.cancel')}
                </Button>
              </Flex>
            )}

            {isCreating && <Progress />}

            {createError && (
              <Alert severity="error" style={{ margin: '1rem 0 0' }}>
                {t('functionLinkCard.createError')}
              </Alert>
            )}
          </div>
        )}
    </InfoCard>
  );
}

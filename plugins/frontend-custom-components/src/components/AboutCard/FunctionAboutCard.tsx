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

import { useCallback, ElementType } from 'react';

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import EditIcon from '@mui/icons-material/Edit';

import { AppIcon, InfoCardVariants, Link } from '@backstage/core-components';
import {
  alertApiRef,
  errorApiRef,
  useApi,
  useRouteRef,
  createExternalRouteRef,
} from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

import {
  ANNOTATION_EDIT_URL,
  ANNOTATION_LOCATION,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import { useEntityPermission } from '@backstage/plugin-catalog-react/alpha';
import { catalogEntityRefreshPermission } from '@backstage/plugin-catalog-common/alpha';
import { catalogTranslationRef } from './translation';

import { AboutContent } from './FunctionAboutContent';
import { useSourceTemplateCompoundEntityRef } from './hooks';

const createFromTemplateRouteRef = createExternalRouteRef({
  id: 'create-from-template',
  optional: true,
  params: ['namespace', 'templateName'],
  defaultTarget: 'scaffolder.selectedTemplate',
});

// TODO: This hook is duplicated from the TechDocs plugin for backwards compatibility
// Remove it when the the legacy frontend system support is dropped.

// TODO: This hook is duplicated from the Scaffolder plugin for backwards compatibility
// Remove it when the the legacy frontend system support is dropped.

const GridItemCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100% - 10px)', // for pages without content header
  marginBottom: '10px',
});

const FullHeightCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const GridItemCardContent = styled(CardContent)({
  flex: 1,
});

const FullHeightCardContent = styled(CardContent)({
  flex: 1,
});

/**
 * Props for {@link EntityAboutCard}.
 *
 * @public
 */
export type AboutCardProps = {
  title?: string;
  variant?: InfoCardVariants;
};

export interface InternalAboutCardProps extends AboutCardProps {
  subheader?: JSX.Element;
}

export function InternalAboutCard(props: InternalAboutCardProps) {
  const { variant } = props;
  const { entity } = useEntity();
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const errorApi = useApi(errorApiRef);
  const templateRoute = useRouteRef(createFromTemplateRouteRef);
  const sourceTemplateRef = useSourceTemplateCompoundEntityRef(entity);
  const { allowed: canRefresh } = useEntityPermission(
    catalogEntityRefreshPermission,
  );
  const { t } = useTranslationRef(catalogTranslationRef);

  const entityMetadataEditUrl =
    entity.metadata.annotations?.[ANNOTATION_EDIT_URL];

  const getCardComponent = (): ElementType => {
    if (variant === 'gridItem') return GridItemCard;
    if (variant === 'fullHeight') return FullHeightCard;
    return Card;
  };
  const CardComponent = getCardComponent();

  const getCardContentComponent = (): ElementType => {
    if (variant === 'gridItem') return GridItemCardContent;
    if (variant === 'fullHeight') return FullHeightCardContent;
    return CardContent;
  };
  const CardContentComponent = getCardContentComponent();

  const entityLocation = entity.metadata.annotations?.[ANNOTATION_LOCATION];
  // Limiting the ability to manually refresh to the less expensive locations
  const allowRefresh =
    entityLocation?.startsWith('url:') || entityLocation?.startsWith('file:');
  const refreshEntity = useCallback(async () => {
    try {
      await catalogApi.refreshEntity(stringifyEntityRef(entity));
      alertApi.post({
        message: t('aboutCard.refreshScheduledMessage'),
        severity: 'info',
        display: 'transient',
      });
    } catch (e) {
      errorApi.post(e instanceof Error ? e : new Error(String(e)));
    }
  }, [catalogApi, entity, alertApi, t, errorApi]);

  return (
    <CardComponent>
      <CardHeader
        title={props.title ?? t('aboutCard.title')}
        action={
          <>
            {allowRefresh && canRefresh && (
              <IconButton
                aria-label="Refresh"
                title={t('aboutCard.refreshButtonTitle')}
                onClick={refreshEntity}
              >
                <CachedIcon />
              </IconButton>
            )}
            <IconButton
              component={Link}
              aria-label="Edit"
              disabled={!entityMetadataEditUrl}
              title={t('aboutCard.editButtonTitle')}
              to={entityMetadataEditUrl ?? '#'}
            >
              <EditIcon />
            </IconButton>
            {sourceTemplateRef && templateRoute && (
              <IconButton
                component={Link}
                title={t('aboutCard.createSimilarButtonTitle')}
                to={templateRoute({
                  namespace: sourceTemplateRef.namespace,
                  templateName: sourceTemplateRef.name,
                })}
              >
                <AppIcon id="scaffolder" />
              </IconButton>
            )}
          </>
        }
      />
      <Divider />
      <CardContentComponent>
        <AboutContent entity={entity} />
      </CardContentComponent>
    </CardComponent>
  );
}

/**
 * Exported publicly via the EntityAboutCard
 *
 * NOTE: We generally do not accept pull requests to extend this class with more
 * props and customizability. If you need to tweak it, consider making a bespoke
 * card in your own repository instead, that is perfect for your own needs.
 */
export function AboutCard(props: AboutCardProps) {
  return <InternalAboutCard {...props} />;
}

export { AboutCard as FunctionAboutCard };

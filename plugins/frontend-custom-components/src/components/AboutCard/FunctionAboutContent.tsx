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

import {
  Entity,
  getEntitySourceLocation,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { makeStyles } from 'tss-react/mui';
import { MarkdownContent } from '@backstage/core-components';
import { AboutField } from './AboutField';
import { LinksGridList } from './LinksGridList';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from './translation';

const useStyles = makeStyles()({
  description: {
    wordBreak: 'break-word',
  },
});

/**
 * Props for {@link AboutContent}.
 *
 * @public
 */
export type AboutContentProps = {
  entity: Entity;
};

function getLocationTargetHref(
  target: string,
  type: string,
  entitySourceLocation: {
    type: string;
    target: string;
  },
): string {
  if (type === 'url' || target.includes('://')) {
    return target;
  }

  const srcLocationUrl =
    entitySourceLocation.type === 'file'
      ? `file://${entitySourceLocation.target}`
      : entitySourceLocation.target;

  if (type === 'file' || entitySourceLocation.type === 'file') {
    return new URL(target, srcLocationUrl).href;
  }

  return srcLocationUrl;
}

/** @public */
export function AboutContent(props: AboutContentProps) {
  const { entity } = props;
  const { classes } = useStyles();
  const { t } = useTranslationRef(catalogTranslationRef);

  const isSystem = entity.kind.toLocaleLowerCase('en-US') === 'system';
  const isResource = entity.kind.toLocaleLowerCase('en-US') === 'resource';
  const isComponent = entity.kind.toLocaleLowerCase('en-US') === 'component';
  const isAPI = entity.kind.toLocaleLowerCase('en-US') === 'api';
  const isTemplate = entity.kind.toLocaleLowerCase('en-US') === 'template';
  const isLocation = entity.kind.toLocaleLowerCase('en-US') === 'location';
  const isGroup = entity.kind.toLocaleLowerCase('en-US') === 'group';
  const isFunction = entity.kind.toLocaleLowerCase('en-US') === 'function';

  const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'system',
  });
  const partOfComponentRelations = getEntityRelations(
    entity,
    RELATION_PART_OF,
    {
      kind: 'component',
    },
  );
  const partOfDomainRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'domain',
  });
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

  let entitySourceLocation:
    | {
        type: string;
        target: string;
      }
    | undefined;
  try {
    entitySourceLocation = getEntitySourceLocation(entity);
  } catch {
    entitySourceLocation = undefined;
  }

  const entityType =
    typeof entity.spec?.type === 'string' ? entity.spec.type : undefined;
  const lifecycle =
    typeof entity.spec?.lifecycle === 'string'
      ? entity.spec.lifecycle
      : undefined;
  const criticality =
    typeof entity.spec?.criticality === 'string'
      ? entity.spec.criticality
      : undefined;
  let locationTargets: string[] = [];
  if (Array.isArray(entity.spec?.targets)) {
    locationTargets = entity.spec.targets.filter(
      (target): target is string => typeof target === 'string',
    );
  } else if (typeof entity.spec?.target === 'string') {
    locationTargets = [entity.spec.target];
  }

  return (
    <Grid container>
      <AboutField
        label={t('aboutCard.descriptionField.label')}
        gridSizes={{ xs: 12 }}
      >
        <MarkdownContent
          className={classes.description}
          content={
            entity?.metadata?.description ||
            t('aboutCard.descriptionField.value')
          }
        />
      </AboutField>
      <AboutField
        label={t('aboutCard.ownerField.label')}
        value={t('aboutCard.ownerField.value')}
        className={classes.description}
        gridSizes={{ xs: 12, sm: 6, lg: 4 }}
      >
        {ownedByRelations.length > 0 && (
          <EntityRefLinks entityRefs={ownedByRelations} defaultKind="group" />
        )}
      </AboutField>
      {(isSystem || partOfDomainRelations.length > 0) && (
        <AboutField
          label={t('aboutCard.domainField.label')}
          value={t('aboutCard.domainField.value')}
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        >
          {partOfDomainRelations.length > 0 && (
            <EntityRefLinks
              entityRefs={partOfDomainRelations}
              defaultKind="domain"
            />
          )}
        </AboutField>
      )}
      {(isAPI ||
        isComponent ||
        isResource ||
        partOfSystemRelations.length > 0) && (
        <AboutField
          label={t('aboutCard.systemField.label')}
          value={t('aboutCard.systemField.value')}
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        >
          {partOfSystemRelations.length > 0 && (
            <EntityRefLinks
              entityRefs={partOfSystemRelations}
              defaultKind="system"
            />
          )}
        </AboutField>
      )}
      {isComponent && partOfComponentRelations.length > 0 && (
        <AboutField
          label={t('aboutCard.parentComponentField.label')}
          value={t('aboutCard.parentComponentField.value')}
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        >
          <EntityRefLinks
            entityRefs={partOfComponentRelations}
            defaultKind="component"
          />
        </AboutField>
      )}
      {(isAPI ||
        isComponent ||
        isResource ||
        isTemplate ||
        isGroup ||
        isLocation ||
        typeof entityType === 'string') &&
        !isFunction && (
          <AboutField
            label={t('aboutCard.typeField.label')}
            value={entityType}
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          />
        )}
      {(isAPI || isComponent || typeof lifecycle === 'string') && (
        <AboutField
          label={t('aboutCard.lifecycleField.label')}
          value={lifecycle}
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        />
      )}
      {!isFunction && (
        <AboutField
          label={t('aboutCard.tagsField.label')}
          value={t('aboutCard.tagsField.value')}
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        >
          {(entity?.metadata?.tags || []).map(tag => (
            <Chip key={tag} size="small" label={tag} />
          ))}
        </AboutField>
      )}

      {isLocation && entitySourceLocation && locationTargets.length > 0 && (
        <AboutField
          label={t('aboutCard.targetsField.label')}
          gridSizes={{ xs: 12 }}
        >
          <LinksGridList
            cols={1}
            items={locationTargets.map(target => ({
              text: target,
              href: getLocationTargetHref(
                target,
                entityType ?? 'unknown',
                entitySourceLocation,
              ),
            }))}
          />
        </AboutField>
      )}
      {isFunction && criticality && (
        <AboutField
          label="Criticality"
          value={criticality}
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        />
      )}
    </Grid>
  );
}

import {
  EntityAboutCard,
  EntityHasSubcomponentsCard,
  EntityLayout,
  EntityLinksCard,
  EntitySwitch,
  isKind,
} from '@backstage/plugin-catalog';
import { Grid } from '@material-ui/core';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';
import {
  entityWarningContent,
  grafanaContent,
  techdocsContent,
} from './entityPages/shared';
import { ComponentPage } from './entityPages/ComponentPages';
import { FunctionEntityPage } from './entityPages/FunctionEntityPage';
import { ApiPage } from './entityPages/ApiPage';
import { UserPage } from './entityPages/UserPage';
import { GroupPage } from './entityPages/GroupPage';
import { SystemPage } from './entityPages/SystemPage';
import { DomainPage } from './entityPages/DomainPage';
import { ResourcePage } from './entityPages/ResourcePage';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { entityPageTabTranslationRef } from '../../utils/translations';

/**
 * NOTE: This page is designed to work on small screens such as mobile devices.
 * This is based on Material UI Grid. If breakpoints are used, each grid item must set the `xs` prop to a column size or to `true`,
 * since this does not default. If no breakpoints are used, the items will equitably share the available space.
 * https://material-ui.com/components/grid/#basic-grid.
 */
export const EntityPage = () => {
  const { t } = useTranslationRef(entityPageTabTranslationRef);

  const overviewContent = (
    <Grid container spacing={3} alignItems="stretch">
      {entityWarningContent}
      <Grid item md={6} xs={12}>
        <EntityAboutCard variant="gridItem" />
      </Grid>
      <Grid item md={6} xs={12}>
        <EntityCatalogGraphCard
          variant="gridItem"
          height={400}
          kinds={['component', 'api', 'system', 'resource']}
          maxDepth={2}
        />
      </Grid>
      <Grid item md={8} xs={12}>
        <EntityLinksCard />
      </Grid>
      <Grid item md={12} xs={12}>
        <EntityHasSubcomponentsCard variant="gridItem" />
      </Grid>
      {grafanaContent}
    </Grid>
  );

  const defaultEntityPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title={t('entityPageTab.overview')}>
        {overviewContent}
      </EntityLayout.Route>
      <EntityLayout.Route path="/docs" title={t('entityPageTab.docs')}>
        {techdocsContent}
      </EntityLayout.Route>
    </EntityLayout>
  );

  return (
    <EntitySwitch>
      <EntitySwitch.Case
        if={isKind('component')}
        children={<ComponentPage />}
      />
      <EntitySwitch.Case if={isKind('api')} children={<ApiPage />} />
      <EntitySwitch.Case if={isKind('group')} children={<GroupPage />} />
      <EntitySwitch.Case if={isKind('user')} children={<UserPage />} />
      <EntitySwitch.Case if={isKind('system')} children={<SystemPage />} />
      <EntitySwitch.Case if={isKind('domain')} children={<DomainPage />} />
      <EntitySwitch.Case if={isKind('resource')} children={<ResourcePage />} />
      <EntitySwitch.Case
        if={isKind('function')}
        children={<FunctionEntityPage />}
      />

      <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
    </EntitySwitch>
  );
};

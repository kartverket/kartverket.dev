import {
  EntityAboutCard,
  EntityHasSubcomponentsCard,
  EntityLayout,
  EntityLinksCard,
  EntitySwitch,
  isKind,
} from '@backstage/plugin-catalog';
import Grid from '@mui/material/Grid';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';
import {
  entityWarningContent,
  grafanaContent,
  techdocsContent,
} from './entityPages/shared';
import { componentPage } from './entityPages/ComponentPages';
import { FunctionEntityPage } from './entityPages/FunctionEntityPage';
import { apiPage } from './entityPages/ApiPage';
import { userPage } from './entityPages/UserPage';
import { groupPage } from './entityPages/GroupPage';
import { systemPage } from './entityPages/SystemPage';
import { domainPage } from './entityPages/DomainPage';
import { resourcePage } from './entityPages/ResourcePage';

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

/**
 * NOTE: This page is designed to work on small screens such as mobile devices.
 * This is based on Material UI Grid. If breakpoints are used, each grid item must set the `xs` prop to a column size or to `true`,
 * since this does not default. If no breakpoints are used, the items will equitably share the available space.
 * https://mui.com/material-ui/react-grid/.
 */
const defaultEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>
    <EntityLayout.Route path="/docs" title="Docs">
      {techdocsContent}
    </EntityLayout.Route>
  </EntityLayout>
);

export const entityPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isKind('component')} children={componentPage} />
    <EntitySwitch.Case if={isKind('api')} children={apiPage} />
    <EntitySwitch.Case if={isKind('group')} children={groupPage} />
    <EntitySwitch.Case if={isKind('user')} children={userPage} />
    <EntitySwitch.Case if={isKind('system')} children={systemPage} />
    <EntitySwitch.Case if={isKind('domain')} children={domainPage} />
    <EntitySwitch.Case if={isKind('resource')} children={resourcePage} />
    <EntitySwitch.Case
      if={isKind('function')}
      children={<FunctionEntityPage />}
    />

    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);

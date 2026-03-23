import { Grid } from '@material-ui/core';
import {
  EntityAboutCard,
  EntityHasComponentsCard,
  EntityHasResourcesCard,
  EntityLayout,
  EntityLinksCard,
} from '@backstage/plugin-catalog';
import { EntityHasApisCard } from '@backstage/plugin-api-docs';
import {
  Direction,
  EntityCatalogGraphCard,
} from '@backstage/plugin-catalog-graph';
import {
  RELATION_API_CONSUMED_BY,
  RELATION_API_PROVIDED_BY,
  RELATION_CONSUMES_API,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_HAS_PART,
  RELATION_PART_OF,
  RELATION_PROVIDES_API,
} from '@backstage/catalog-model';
import { SecurityChampionCard } from '@kartverket/backstage-plugin-security-champion';
import { RiScPage } from '@kartverket/backstage-plugin-risk-scorecard';
import { SecurityMetricsPage } from '@kartverket/backstage-plugin-security-metrics-frontend';
import { EntityFunctionsCard } from '@internal/plugin-frontend-custom-components';
import { entityWarningContent } from './shared';

export const systemPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        {entityWarningContent}
        <Grid item md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityCatalogGraphCard
            variant="gridItem"
            height={400}
            kinds={['component', 'system', 'domain', 'resource']}
            maxDepth={2}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <SecurityChampionCard />
        </Grid>
        <Grid item md={8}>
          <EntityHasComponentsCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasApisCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasResourcesCard variant="gridItem" />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityLinksCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityFunctionsCard title="Functions" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/diagram" title="Diagram">
      <EntityCatalogGraphCard
        variant="gridItem"
        direction={Direction.TOP_BOTTOM}
        title="System Diagram"
        height={700}
        relations={[
          RELATION_PART_OF,
          RELATION_HAS_PART,
          RELATION_API_CONSUMED_BY,
          RELATION_API_PROVIDED_BY,
          RELATION_CONSUMES_API,
          RELATION_PROVIDES_API,
          RELATION_DEPENDENCY_OF,
          RELATION_DEPENDS_ON,
        ]}
        unidirectional={false}
        kinds={['System', 'Component', 'Api', 'Resource', 'Domain']}
        maxDepth={3}
      />
    </EntityLayout.Route>

    <EntityLayout.Route path="/risc" title="Kodenær RoS">
      <RiScPage />
    </EntityLayout.Route>

    <EntityLayout.Route path="/securityMetrics" title="Sikkerhetsmetrikker">
      <SecurityMetricsPage />
    </EntityLayout.Route>
  </EntityLayout>
);

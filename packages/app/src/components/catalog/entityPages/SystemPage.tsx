import Grid from '@mui/material/Grid';
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
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { entityPageTabTranslationRef } from '../../../utils/translations';

export const SystemPage = () => {
  const { t } = useTranslationRef(entityPageTabTranslationRef);

  return (
    <EntityLayout>
      <EntityLayout.Route path="/" title={t('entityPageTab.overview')}>
        <Grid container spacing={3} alignItems="stretch">
          {entityWarningContent}
          <Grid size={{ md: 6 }}>
            <EntityAboutCard variant="gridItem" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <EntityCatalogGraphCard
              variant="gridItem"
              height={400}
              kinds={['component', 'system', 'domain', 'resource']}
              maxDepth={2}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SecurityChampionCard />
          </Grid>
          <Grid size={{ md: 8 }}>
            <EntityHasComponentsCard variant="gridItem" />
          </Grid>
          <Grid size={{ md: 6 }}>
            <EntityHasApisCard variant="gridItem" />
          </Grid>
          <Grid size={{ md: 6 }}>
            <EntityHasResourcesCard variant="gridItem" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <EntityLinksCard />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <EntityFunctionsCard title={t('entityPageTab.functions')} />
          </Grid>
        </Grid>
      </EntityLayout.Route>
      <EntityLayout.Route path="/diagram" title={t('entityPageTab.diagram')}>
        <EntityCatalogGraphCard
          variant="gridItem"
          direction={Direction.TOP_BOTTOM}
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

      <EntityLayout.Route path="/risc" title={t('entityPageTab.risc')}>
        <RiScPage />
      </EntityLayout.Route>

      <EntityLayout.Route
        path="/securityMetrics"
        title={t('entityPageTab.securityMetrics')}
      >
        <SecurityMetricsPage />
      </EntityLayout.Route>
    </EntityLayout>
  );
};

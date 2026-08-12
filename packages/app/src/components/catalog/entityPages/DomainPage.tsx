import Grid from '@mui/material/Grid';
import {
  EntityAboutCard,
  EntityHasSystemsCard,
  EntityLayout,
} from '@backstage/plugin-catalog';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';
import { SecurityChampionCard } from '@kartverket/backstage-plugin-security-champion';
import { CatalogCreatorContainer } from '../CatalogCreatorContainer';
import { IntegrationBoundary } from '../../IntegrationBoundary';
import { entityWarningContent } from './shared';

export const domainPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        {entityWarningContent}
        <Grid size={{ md: 6 }}>
          <EntityAboutCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <EntityCatalogGraphCard
            height={400}
            kinds={['System', 'Group', 'Domain']}
          />
        </Grid>
        <Grid size={{ md: 6 }}>
          <IntegrationBoundary
            configKey="securityChampion"
            title="Security Champion"
          >
            <SecurityChampionCard />
          </IntegrationBoundary>
        </Grid>
        <Grid size={{ md: 6 }}>
          <EntityHasSystemsCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/edit" title="Edit">
      <CatalogCreatorContainer />
    </EntityLayout.Route>
  </EntityLayout>
);

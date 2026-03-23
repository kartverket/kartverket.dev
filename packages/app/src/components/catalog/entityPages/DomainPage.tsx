import Grid from '@mui/material/Grid';
import {
  EntityAboutCard,
  EntityHasSystemsCard,
  EntityLayout,
} from '@backstage/plugin-catalog';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';
import { SecurityChampionCard } from '@kartverket/backstage-plugin-security-champion';
import { entityWarningContent } from './shared';

export const domainPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        {entityWarningContent}
        <Grid size={{ md: 6 }}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <EntityCatalogGraphCard
            variant="gridItem"
            height={400}
            kinds={['System', 'Group', 'Domain']}
          />
        </Grid>
        <Grid size={{ md: 6 }}>
          <SecurityChampionCard />
        </Grid>
        <Grid size={{ md: 6 }}>
          <EntityHasSystemsCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);

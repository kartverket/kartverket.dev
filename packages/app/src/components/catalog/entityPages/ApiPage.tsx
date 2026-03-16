import Grid from '@mui/material/Grid';
import {
  EntityApiDefinitionCard,
  EntityProvidingComponentsCard,
} from '@backstage/plugin-api-docs';
import {
  EntityAboutCard,
  EntityLayout,
  EntityLinksCard,
} from '@backstage/plugin-catalog';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';
import { CatalogCreatorContainer } from '../CatalogCreatorContainer';
import { entityWarningContent } from './shared';

export const apiPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        {entityWarningContent}
        <Grid size={{ md: 6 }}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <EntityCatalogGraphCard
            height={400}
            variant="gridItem"
            kinds={['component', 'api', 'system', 'resource']}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <EntityLinksCard variant="gridItem" />
        </Grid>
        <Grid size={{ md: 6 }}>
          <EntityProvidingComponentsCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/edit" title="Edit">
      <CatalogCreatorContainer />
    </EntityLayout.Route>
    <EntityLayout.Route path="/definition" title="Definition">
      <Grid container spacing={3}>
        <Grid size={12}>
          <EntityApiDefinitionCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);

import Grid from '@mui/material/Grid';
import { EntityLayout } from '@backstage/plugin-catalog';
import {
  EntityUserProfileCard,
  EntityOwnershipCard,
} from '@backstage/plugin-org';
import { entityWarningContent } from './shared';

export const userPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        {entityWarningContent}
        <Grid size={{ xs: 12, md: 6 }}>
          <EntityUserProfileCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <EntityOwnershipCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);

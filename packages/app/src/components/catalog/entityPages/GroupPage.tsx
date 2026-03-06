import { Grid } from '@mui/material';
import { EntityLayout } from '@backstage/plugin-catalog';
import {
  EntityGroupProfileCard,
  EntityMembersListCard,
  EntityOwnershipCard,
} from '@backstage/plugin-org';
import { SecurityChampionCard } from '@kartverket/backstage-plugin-security-champion';
import { SecurityMetricsPage } from '@kartverket/backstage-plugin-security-metrics-frontend';
import { Flex } from '@backstage/ui';
import { GroupFormLinksCard } from '@internal/plugin-frontend-custom-components';
import { entityWarningContent } from './shared';

export const groupPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        {entityWarningContent}
        <Grid item xs={12} md={6}>
          <EntityGroupProfileCard variant="gridItem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityOwnershipCard
            entityLimit={9}
            variant="gridItem"
            entityFilterKind={[
              'Domain',
              'System',
              'Component',
              'API',
              'Template',
              'Resource',
              'Function',
            ]}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SecurityChampionCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <Flex direction="column" gap="24px">
            <GroupFormLinksCard />
          </Flex>
        </Grid>
        <Grid item xs={12} md={12}>
          <EntityMembersListCard showAggregateMembersToggle />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/securityMetrics" title="Sikkerhetsmetrikker">
      <SecurityMetricsPage />
    </EntityLayout.Route>
  </EntityLayout>
);

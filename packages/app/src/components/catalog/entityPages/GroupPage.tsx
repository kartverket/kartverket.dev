import Grid from '@mui/material/Grid';
import { EntityLayout } from '@backstage/plugin-catalog';
import {
  EntityMembersListCard,
  EntityOwnershipCard,
} from '@backstage/plugin-org';
import { SecurityChampionCard } from '@kartverket/backstage-plugin-security-champion';
import { SecurityMetricsPage } from '@kartverket/backstage-plugin-security-metrics-frontend';
import { Flex } from '@backstage/ui';
import {
  GroupSecurityFormsCard,
  GroupProfileCard,
} from '@internal/plugin-frontend-custom-components';
import { entityWarningContent } from './shared';

export const groupPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        {entityWarningContent}
        <Grid size={{ xs: 12, md: 6 }}>
          <GroupProfileCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <EntityOwnershipCard
            entityLimit={9}
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
        <Grid size={{ xs: 12, md: 6 }}>
          <SecurityChampionCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Flex direction="column" gap="24px">
            <GroupSecurityFormsCard />
          </Flex>
        </Grid>
        <Grid size={12}>
          <EntityMembersListCard showAggregateMembersToggle />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/securityMetrics" title="Sikkerhetsmetrikker">
      <SecurityMetricsPage />
    </EntityLayout.Route>
  </EntityLayout>
);

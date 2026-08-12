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
import { IntegrationBoundary } from '../../IntegrationBoundary';

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
          <IntegrationBoundary
            configKey="securityChampion"
            title="Security Champion"
          >
            <SecurityChampionCard />
          </IntegrationBoundary>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Flex direction="column" gap="24px">
            <IntegrationBoundary configKey="regelrett" title="Regelrett">
              <GroupSecurityFormsCard />
            </IntegrationBoundary>
          </Flex>
        </Grid>
        <Grid size={12}>
          <EntityMembersListCard showAggregateMembersToggle />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/securityMetrics" title="Sikkerhetsmetrikker">
      <IntegrationBoundary
        configKey="sikkerhetsmetrikker"
        title="Security Metrics"
      >
        <SecurityMetricsPage />
      </IntegrationBoundary>
    </EntityLayout.Route>
  </EntityLayout>
);

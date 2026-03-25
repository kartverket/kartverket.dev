import { Grid } from '@material-ui/core';
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
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { entityPageTabTranslationRef } from '../../../utils/translations';

export const GroupPage = () => {
  const { t } = useTranslationRef(entityPageTabTranslationRef);

  return (
    <EntityLayout>
      <EntityLayout.Route path="/" title={t('entityPageTab.overview')}>
        <Grid container spacing={3}>
          {entityWarningContent}
          <Grid item xs={12} md={6}>
            <GroupProfileCard variant="gridItem" />
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
              <GroupSecurityFormsCard />
            </Flex>
          </Grid>
          <Grid item xs={12} md={12}>
            <EntityMembersListCard showAggregateMembersToggle />
          </Grid>
        </Grid>
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

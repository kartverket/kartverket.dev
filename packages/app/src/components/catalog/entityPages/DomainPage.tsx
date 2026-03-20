import { Grid } from '@material-ui/core';
import {
  EntityAboutCard,
  EntityHasSystemsCard,
  EntityLayout,
} from '@backstage/plugin-catalog';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';
import { SecurityChampionCard } from '@kartverket/backstage-plugin-security-champion';
import { entityWarningContent } from './shared';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { entityPageTabTranslationRef } from '../../../utils/translations';

export const DomainPage = () => {
  const { t } = useTranslationRef(entityPageTabTranslationRef);

  return (
    <EntityLayout>
      <EntityLayout.Route path="/" title={t('entityPageTab.overview')}>
        <Grid container spacing={3} alignItems="stretch">
          {entityWarningContent}
          <Grid item md={6}>
            <EntityAboutCard variant="gridItem" />
          </Grid>
          <Grid item md={6} xs={12}>
            <EntityCatalogGraphCard
              variant="gridItem"
              height={400}
              kinds={['System', 'Group', 'Domain']}
            />
          </Grid>
          <Grid item md={6}>
            <SecurityChampionCard />
          </Grid>
          <Grid item md={6}>
            <EntityHasSystemsCard variant="gridItem" />
          </Grid>
        </Grid>
      </EntityLayout.Route>
    </EntityLayout>
  );
};

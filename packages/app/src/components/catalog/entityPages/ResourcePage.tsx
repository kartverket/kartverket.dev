import { Grid } from '@material-ui/core';
import {
  EntityAboutCard,
  EntityLayout,
  EntityLinksCard,
} from '@backstage/plugin-catalog';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';
import { entityWarningContent, techdocsContent } from './shared';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { entityPageTabTranslationRef } from '../../../utils/translations';

export const ResourcePage = () => {
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
              kinds={['Component', 'Api', 'System']}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <EntityLinksCard />
          </Grid>
        </Grid>
      </EntityLayout.Route>
      <EntityLayout.Route path="/docs" title={t('entityPageTab.docs')}>
        {techdocsContent}
      </EntityLayout.Route>
    </EntityLayout>
  );
};

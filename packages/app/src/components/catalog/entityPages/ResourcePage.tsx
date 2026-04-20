import Grid from '@mui/material/Grid';
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
          <Grid size={{ md: 6 }}>
            <EntityAboutCard variant="gridItem" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <EntityCatalogGraphCard
              variant="gridItem"
              height={400}
              kinds={['Component', 'Api', 'System']}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
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

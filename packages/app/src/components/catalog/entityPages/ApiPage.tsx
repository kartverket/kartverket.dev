import { Grid } from '@material-ui/core';
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
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { entityPageTabTranslationRef } from '../../../utils/translations';

export const ApiPage = () => {
  const { t } = useTranslationRef(entityPageTabTranslationRef);

  return (
    <EntityLayout>
      <EntityLayout.Route path="/" title={t('entityPageTab.overview')}>
        <Grid container spacing={3}>
          {entityWarningContent}
          <Grid item md={6}>
            <EntityAboutCard variant="gridItem" />
          </Grid>
          <Grid item md={6} xs={12}>
            <EntityCatalogGraphCard
              height={400}
              variant="gridItem"
              kinds={['component', 'api', 'system', 'resource']}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <EntityLinksCard variant="gridItem" />
          </Grid>
          <Grid item md={6}>
            <EntityProvidingComponentsCard variant="gridItem" />
          </Grid>
        </Grid>
      </EntityLayout.Route>
      <EntityLayout.Route path="/edit" title={t('entityPageTab.edit')}>
        <CatalogCreatorContainer />
      </EntityLayout.Route>
      <EntityLayout.Route
        path="/definition"
        title={t('entityPageTab.definition')}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <EntityApiDefinitionCard />
          </Grid>
        </Grid>
      </EntityLayout.Route>
    </EntityLayout>
  );
};

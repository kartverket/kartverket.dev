import { Grid } from '@material-ui/core';
import { EntityLayout } from '@backstage/plugin-catalog';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  FunctionAboutCard,
  FunctionDependenciesCard,
  FunctionSecurityFormsCard,
} from '@internal/plugin-frontend-custom-components';
import { CatalogCreatorContainer } from '../CatalogCreatorContainer';
import { CatalogCreatorPageComponent } from '@kartverket/backstage-plugin-catalog-creator';
import { entityWarningContent } from './shared';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { functionEntityPageTranslationRef } from '../../../utils/translations';

export const FunctionEntityPage = () => {
  const { entity } = useEntity();
  const { t } = useTranslationRef(functionEntityPageTranslationRef);

  return (
    <EntityLayout>
      <EntityLayout.Route
        path="/"
        title={t('functionEntityPage.overviewTitle')}
      >
        <Grid container spacing={3} alignItems="stretch">
          {entityWarningContent}
          <Grid item md={6}>
            <FunctionAboutCard
              variant="gridItem"
              title={t('functionEntityPage.aboutTitle')}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <EntityCatalogGraphCard
              variant="gridItem"
              height={400}
              kinds={['function', 'component', 'system', 'resource']}
              title={t('functionEntityPage.graphTitle')}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <FunctionDependenciesCard />
          </Grid>
          <Grid item md={6} xs={12}>
            <FunctionSecurityFormsCard />
          </Grid>
        </Grid>
      </EntityLayout.Route>
      <EntityLayout.Route
        path="/edit"
        title={t('functionEntityPage.editTitle')}
      >
        <CatalogCreatorContainer />
      </EntityLayout.Route>
      <EntityLayout.Route
        path="/create-subfunction"
        title={t('functionEntityPage.createSubFunctionTitle')}
      >
        <CatalogCreatorPageComponent
          createSubFunction
          entityName={entity.metadata.title}
        />
      </EntityLayout.Route>
    </EntityLayout>
  );
};

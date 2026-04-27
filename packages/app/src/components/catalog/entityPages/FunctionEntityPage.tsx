import Grid from '@mui/material/Grid';
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
          <Grid size={{ md: 6 }}>
            <FunctionAboutCard title={t('functionEntityPage.aboutTitle')} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <EntityCatalogGraphCard
              height={400}
              kinds={['function', 'component', 'system', 'resource']}
              title={t('functionEntityPage.graphTitle')}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FunctionDependenciesCard />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
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

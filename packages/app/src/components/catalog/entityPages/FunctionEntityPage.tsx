import { Grid } from '@material-ui/core';
import { EntityLayout } from '@backstage/plugin-catalog';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  EntityDependenciesCard,
  FunctionAboutCard,
  FunctionLinksCard,
} from '@internal/plugin-frontend-custom-components';
import { CatalogCreatorContainer } from '../CatalogCreatorContainer';
import { CatalogCreatorPageComponent } from '@kartverket/backstage-plugin-catalog-creator';
import { entityWarningContent } from './shared';

export const FunctionEntityPage = () => {
  const { entity } = useEntity();

  return (
    <EntityLayout>
      <EntityLayout.Route path="/" title="Overview">
        <Grid container spacing={3} alignItems="stretch">
          {entityWarningContent}
          <Grid item md={6}>
            <FunctionAboutCard variant="gridItem" />
          </Grid>
          <Grid item md={6} xs={12}>
            <EntityCatalogGraphCard
              variant="gridItem"
              height={400}
              kinds={['function', 'component', 'system', 'resource']}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <EntityDependenciesCard />
          </Grid>
          <Grid item md={6} xs={12}>
            <FunctionLinksCard />
          </Grid>
        </Grid>
      </EntityLayout.Route>
      <EntityLayout.Route path="/edit" title="Edit">
        <CatalogCreatorContainer />
      </EntityLayout.Route>
      <EntityLayout.Route
        path="/create-subfunction"
        title="Create new subfunction"
      >
        <CatalogCreatorPageComponent
          createSubFunction
          entityName={entity.metadata.title}
        />
      </EntityLayout.Route>
    </EntityLayout>
  );
};

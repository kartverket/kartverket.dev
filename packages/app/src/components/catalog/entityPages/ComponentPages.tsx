import Grid from '@mui/material/Grid';
import {
  EntityDependsOnComponentsCard,
  EntityDependsOnResourcesCard,
  EntityLayout,
  EntitySwitch,
  isComponentType,
} from '@backstage/plugin-catalog';
import { EntityLighthouseContent } from '@backstage-community/plugin-lighthouse';
import { RiScPage } from '@kartverket/backstage-plugin-risk-scorecard';
import { SecurityMetricsPage } from '@kartverket/backstage-plugin-security-metrics-frontend';
import { CatalogCreatorContainer } from '../CatalogCreatorContainer';
import {
  techdocsContent,
  cicdContent,
  defaultComponentContent,
} from './shared';
import {
  EntityConsumedApisCard,
  EntityProvidedApisCard,
} from '@backstage/plugin-api-docs';

const serviceEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {defaultComponentContent}
    </EntityLayout.Route>
    <EntityLayout.Route path="/edit" title="Edit">
      <CatalogCreatorContainer />
    </EntityLayout.Route>
    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/api" title="API">
      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ md: 6 }}>
          <EntityProvidedApisCard />
        </Grid>
        <Grid size={{ md: 6 }}>
          <EntityConsumedApisCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route path="/dependencies" title="Dependencies">
      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ md: 6 }}>
          <EntityDependsOnComponentsCard />
        </Grid>
        <Grid size={{ md: 6 }}>
          <EntityDependsOnResourcesCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route path="/docs" title="Docs">
      {techdocsContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/risc" title="Operasjonell RoS">
      <RiScPage />
    </EntityLayout.Route>

    <EntityLayout.Route path="/securityMetrics" title="Sikkerhetsmetrikker">
      <SecurityMetricsPage />
    </EntityLayout.Route>
  </EntityLayout>
);

const websiteEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {defaultComponentContent}
    </EntityLayout.Route>
    <EntityLayout.Route path="/edit" title="Edit">
      <CatalogCreatorContainer />
    </EntityLayout.Route>

    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/dependencies" title="Dependencies">
      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ md: 6 }}>
          <EntityDependsOnComponentsCard />
        </Grid>
        <Grid size={{ md: 6 }}>
          <EntityDependsOnResourcesCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route path="/docs" title="Docs">
      {techdocsContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/lighthouse" title="Lighthouse">
      <EntityLighthouseContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/risc" title="Operasjonell RoS">
      <RiScPage />
    </EntityLayout.Route>

    <EntityLayout.Route path="/securityMetrics" title="Sikkerhetsmetrikker">
      <SecurityMetricsPage />
    </EntityLayout.Route>
  </EntityLayout>
);

const opsEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {defaultComponentContent}
    </EntityLayout.Route>
    <EntityLayout.Route path="/edit" title="Edit">
      <CatalogCreatorContainer />
    </EntityLayout.Route>

    <EntityLayout.Route path="/risc" title="Operasjonell RoS">
      <RiScPage />
    </EntityLayout.Route>

    <EntityLayout.Route path="/securityMetrics" title="Sikkerhetsmetrikker">
      <SecurityMetricsPage />
    </EntityLayout.Route>
  </EntityLayout>
);

const libraryEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {defaultComponentContent}
    </EntityLayout.Route>
    <EntityLayout.Route path="/edit" title="Edit">
      <CatalogCreatorContainer />
    </EntityLayout.Route>
    <EntityLayout.Route path="/risc" title="Operasjonell RoS">
      <RiScPage />
    </EntityLayout.Route>
    <EntityLayout.Route path="/securityMetrics" title="Sikkerhetsmetrikker">
      <SecurityMetricsPage />
    </EntityLayout.Route>
  </EntityLayout>
);

const simpleComponentPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {defaultComponentContent}
    </EntityLayout.Route>
    <EntityLayout.Route path="/edit" title="Edit">
      <CatalogCreatorContainer />
    </EntityLayout.Route>

    <EntityLayout.Route path="/docs" title="Docs">
      {techdocsContent}
    </EntityLayout.Route>
  </EntityLayout>
);

const defaultComponentPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {defaultComponentContent}
    </EntityLayout.Route>
    <EntityLayout.Route path="/edit" title="Edit">
      <CatalogCreatorContainer />
    </EntityLayout.Route>

    <EntityLayout.Route path="/risc" title="Operasjonell RoS">
      <RiScPage />
    </EntityLayout.Route>

    <EntityLayout.Route path="/securityMetrics" title="Sikkerhetsmetrikker">
      <SecurityMetricsPage />
    </EntityLayout.Route>
  </EntityLayout>
);

export const componentPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isComponentType('service')}>
      {serviceEntityPage}
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isComponentType('website')}>
      {websiteEntityPage}
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isComponentType('ops')}>
      {opsEntityPage}
    </EntitySwitch.Case>
    <EntitySwitch.Case if={isComponentType('library')}>
      {libraryEntityPage}
    </EntitySwitch.Case>
    <EntitySwitch.Case if={isComponentType('experiment')}>
      {simpleComponentPage}
    </EntitySwitch.Case>
    <EntitySwitch.Case if={isComponentType('documentation')}>
      {simpleComponentPage}
    </EntitySwitch.Case>

    <EntitySwitch.Case>{defaultComponentPage}</EntitySwitch.Case>
  </EntitySwitch>
);

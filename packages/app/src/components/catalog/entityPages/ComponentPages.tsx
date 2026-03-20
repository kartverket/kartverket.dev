import { Grid } from '@material-ui/core';
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
  CicdContent,
  DefaultComponentContent,
} from './shared';
import {
  EntityConsumedApisCard,
  EntityProvidedApisCard,
} from '@backstage/plugin-api-docs';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { entityPageTabTranslationRef } from '../../../utils/translations';

export const ComponentPage = () => {
  const { t } = useTranslationRef(entityPageTabTranslationRef);

  const serviceEntityPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title={t('entityPageTab.overview')}>
        <DefaultComponentContent />
      </EntityLayout.Route>
      <EntityLayout.Route path="/edit" title={t('entityPageTab.edit')}>
        <CatalogCreatorContainer />
      </EntityLayout.Route>
      <EntityLayout.Route path="/ci-cd" title={t('entityPageTab.cicd')}>
        <CicdContent />
      </EntityLayout.Route>

      <EntityLayout.Route path="/api" title={t('entityPageTab.api')}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item md={6}>
            <EntityProvidedApisCard />
          </Grid>
          <Grid item md={6}>
            <EntityConsumedApisCard />
          </Grid>
        </Grid>
      </EntityLayout.Route>

      <EntityLayout.Route
        path="/dependencies"
        title={t('entityPageTab.dependencies')}
      >
        <Grid container spacing={3} alignItems="stretch">
          <Grid item md={6}>
            <EntityDependsOnComponentsCard variant="gridItem" />
          </Grid>
          <Grid item md={6}>
            <EntityDependsOnResourcesCard variant="gridItem" />
          </Grid>
        </Grid>
      </EntityLayout.Route>

      <EntityLayout.Route path="/docs" title={t('entityPageTab.docs')}>
        {techdocsContent}
      </EntityLayout.Route>

      <EntityLayout.Route path="/risc" title={t('entityPageTab.risc')}>
        <RiScPage />
      </EntityLayout.Route>

      <EntityLayout.Route
        path="/securityMetrics"
        title={t('entityPageTab.securityMetrics')}
      >
        <SecurityMetricsPage />
      </EntityLayout.Route>
    </EntityLayout>
  );

  const websiteEntityPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title={t('entityPageTab.overview')}>
        <DefaultComponentContent />
      </EntityLayout.Route>
      <EntityLayout.Route path="/edit" title={t('entityPageTab.edit')}>
        <CatalogCreatorContainer />
      </EntityLayout.Route>

      <EntityLayout.Route path="/ci-cd" title={t('entityPageTab.cicd')}>
        <CicdContent />
      </EntityLayout.Route>

      <EntityLayout.Route
        path="/dependencies"
        title={t('entityPageTab.dependencies')}
      >
        <Grid container spacing={3} alignItems="stretch">
          <Grid item md={6}>
            <EntityDependsOnComponentsCard variant="gridItem" />
          </Grid>
          <Grid item md={6}>
            <EntityDependsOnResourcesCard variant="gridItem" />
          </Grid>
        </Grid>
      </EntityLayout.Route>

      <EntityLayout.Route path="/docs" title={t('entityPageTab.docs')}>
        {techdocsContent}
      </EntityLayout.Route>

      <EntityLayout.Route
        path="/lighthouse"
        title={t('entityPageTab.lighthouse')}
      >
        <EntityLighthouseContent />
      </EntityLayout.Route>

      <EntityLayout.Route path="/risc" title={t('entityPageTab.risc')}>
        <RiScPage />
      </EntityLayout.Route>

      <EntityLayout.Route
        path="/securityMetrics"
        title={t('entityPageTab.securityMetrics')}
      >
        <SecurityMetricsPage />
      </EntityLayout.Route>
    </EntityLayout>
  );

  const opsEntityPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title={t('entityPageTab.overview')}>
        <DefaultComponentContent />
      </EntityLayout.Route>
      <EntityLayout.Route path="/edit" title={t('entityPageTab.edit')}>
        <CatalogCreatorContainer />
      </EntityLayout.Route>

      <EntityLayout.Route path="/risc" title={t('entityPageTab.risc')}>
        <RiScPage />
      </EntityLayout.Route>

      <EntityLayout.Route
        path="/securityMetrics"
        title={t('entityPageTab.securityMetrics')}
      >
        <SecurityMetricsPage />
      </EntityLayout.Route>
    </EntityLayout>
  );

  const libraryEntityPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title={t('entityPageTab.overview')}>
        <DefaultComponentContent />
      </EntityLayout.Route>
      <EntityLayout.Route path="/edit" title={t('entityPageTab.edit')}>
        <CatalogCreatorContainer />
      </EntityLayout.Route>
      <EntityLayout.Route path="/risc" title={t('entityPageTab.risc')}>
        <RiScPage />
      </EntityLayout.Route>
      <EntityLayout.Route
        path="/securityMetrics"
        title={t('entityPageTab.securityMetrics')}
      >
        <SecurityMetricsPage />
      </EntityLayout.Route>
    </EntityLayout>
  );

  const simpleComponentPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title={t('entityPageTab.overview')}>
        <DefaultComponentContent />
      </EntityLayout.Route>
      <EntityLayout.Route path="/edit" title={t('entityPageTab.edit')}>
        <CatalogCreatorContainer />
      </EntityLayout.Route>

      <EntityLayout.Route path="/docs" title={t('entityPageTab.docs')}>
        {techdocsContent}
      </EntityLayout.Route>
    </EntityLayout>
  );

  const defaultComponentPage = (
    <EntityLayout>
      <EntityLayout.Route path="/" title={t('entityPageTab.overview')}>
        <DefaultComponentContent />
      </EntityLayout.Route>
      <EntityLayout.Route path="/edit" title={t('entityPageTab.edit')}>
        <CatalogCreatorContainer />
      </EntityLayout.Route>

      <EntityLayout.Route path="/risc" title={t('entityPageTab.risc')}>
        <RiScPage />
      </EntityLayout.Route>

      <EntityLayout.Route
        path="/securityMetrics"
        title={t('entityPageTab.securityMetrics')}
      >
        <SecurityMetricsPage />
      </EntityLayout.Route>
    </EntityLayout>
  );

  return (
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
};

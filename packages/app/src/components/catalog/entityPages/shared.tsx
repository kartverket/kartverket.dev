import { Button, Grid } from '@mui/material';
import {
  EntityAboutCard,
  EntityHasSubcomponentsCard,
  EntityLinksCard,
  EntitySwitch,
  EntityOrphanWarning,
  EntityProcessingErrorsPanel,
  isOrphan,
  hasRelationWarnings,
  EntityRelationWarning,
  hasCatalogProcessingErrors,
} from '@backstage/plugin-catalog';
import {
  isGithubActionsAvailable,
  EntityGithubActionsContent,
} from '@backstage-community/plugin-github-actions';
import { EntityTechdocsContent } from '@backstage/plugin-techdocs';
import { EmptyState } from '@backstage/core-components';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { Mermaid } from 'backstage-plugin-techdocs-addon-mermaid';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import {
  EntityGrafanaAlertsCard,
  EntityGrafanaDashboardsCard,
  EntityOverviewDashboardViewer,
  isAlertSelectorAvailable,
  isDashboardSelectorAvailable,
  isOverviewDashboardAvailable,
} from '@backstage-community/plugin-grafana';
import { SecurityChampionCard } from '@kartverket/backstage-plugin-security-champion';
import { EntityFunctionsCard } from '@internal/plugin-frontend-custom-components';

export const techdocsContent = (
  <EntityTechdocsContent>
    <TechDocsAddons>
      <ReportIssue />
      <Mermaid
        config={{ theme: 'forest', themeVariables: { lineColor: '#000000' } }}
      />
    </TechDocsAddons>
  </EntityTechdocsContent>
);

export const grafanaContent = (
  <>
    <EntitySwitch>
      <EntitySwitch.Case if={isAlertSelectorAvailable}>
        <Grid item md={6}>
          <EntityGrafanaAlertsCard showState />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
    <EntitySwitch>
      <EntitySwitch.Case
        if={entity => Boolean(isDashboardSelectorAvailable(entity))}
      >
        <Grid item md={6}>
          <EntityGrafanaDashboardsCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
    <EntitySwitch>
      <EntitySwitch.Case if={isOverviewDashboardAvailable}>
        <Grid item md={12}>
          <EntityOverviewDashboardViewer />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </>
);

export const cicdContent = (
  <EntitySwitch>
    <EntitySwitch.Case if={isGithubActionsAvailable}>
      <EntityGithubActionsContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case>
      <EmptyState
        title="No CI/CD available for this entity"
        missing="info"
        description="You need to add an annotation to your component if you want to enable CI/CD for it. You can read more about annotations in Backstage by clicking the button below."
        action={
          <Button
            variant="contained"
            color="primary"
            href="https://backstage.io/docs/features/software-catalog/well-known-annotations"
          >
            Read more
          </Button>
        }
      />
    </EntitySwitch.Case>
  </EntitySwitch>
);

export const entityWarningContent = (
  <>
    <EntitySwitch>
      <EntitySwitch.Case if={isOrphan}>
        <Grid item xs={12}>
          <EntityOrphanWarning />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={hasRelationWarnings}>
        <Grid item xs={12}>
          <EntityRelationWarning />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={hasCatalogProcessingErrors}>
        <Grid item xs={12}>
          <EntityProcessingErrorsPanel />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </>
);

export const defaultComponentContent = (
  <Grid container spacing={3} alignItems="stretch">
    {entityWarningContent}
    <Grid item md={6} xs={12}>
      <EntityAboutCard variant="gridItem" />
    </Grid>
    <Grid item md={6} xs={12}>
      <EntityCatalogGraphCard variant="gridItem" height={400} />
    </Grid>
    <Grid item md={4} xs={12}>
      <SecurityChampionCard />
    </Grid>
    <Grid item md={8} xs={12}>
      <EntityLinksCard />
    </Grid>
    <Grid item md={12} xs={12}>
      <EntityHasSubcomponentsCard variant="gridItem" />
    </Grid>
    <Grid item md={12} xs={12}>
      <EntityFunctionsCard title="Functions" variant="gridItem" />
    </Grid>
    {grafanaContent}
  </Grid>
);

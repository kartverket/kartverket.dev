import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
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
        <Grid size={{ md: 6 }}>
          <EntityGrafanaAlertsCard showState />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
    <EntitySwitch>
      <EntitySwitch.Case
        if={entity => Boolean(isDashboardSelectorAvailable(entity))}
      >
        <Grid size={{ md: 6 }}>
          <EntityGrafanaDashboardsCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
    <EntitySwitch>
      <EntitySwitch.Case if={isOverviewDashboardAvailable}>
        <Grid size={{ md: 12 }}>
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
        <Grid size={12}>
          <EntityOrphanWarning />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={hasRelationWarnings}>
        <Grid size={12}>
          <EntityRelationWarning />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={hasCatalogProcessingErrors}>
        <Grid size={12}>
          <EntityProcessingErrorsPanel />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </>
);

export const defaultComponentContent = (
  <Grid container spacing={3} alignItems="stretch">
    {entityWarningContent}
    <Grid size={{ xs: 12, md: 6 }}>
      <EntityAboutCard />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <EntityCatalogGraphCard height={400} />
    </Grid>
    <Grid size={{ xs: 12, md: 4 }}>
      <SecurityChampionCard />
    </Grid>
    <Grid size={{ xs: 12, md: 8 }}>
      <EntityLinksCard />
    </Grid>
    <Grid size={12}>
      <EntityHasSubcomponentsCard />
    </Grid>
    <Grid size={12}>
      <EntityFunctionsCard title="Functions" />
    </Grid>
    {grafanaContent}
  </Grid>
);

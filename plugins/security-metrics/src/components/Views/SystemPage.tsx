import { Progress } from '@backstage/core-components';
import Stack from '@mui/material/Stack';
import { RepositoriesTable } from '../RepositoriesTable/RepositoriesTable';
import { SystemScannerStatuses } from '../ScannerStatus/SystemScannerStatuses';
import { Secrets } from '../SecretsOverview/SecretsAlert';
import { Trend } from '../Trend/Trend';
import { VulnerabilityCountsOverview } from '../VulnerabilityCounts/VulnerabilityCountsOverview';
import { SystemRiscStatuses } from '../RiscStatus/SystemRiscStatuses';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ErrorBanner } from '../shared/ErrorBanner';
import { useOverviewQuery } from '../../hooks/useOverviewQuery';
import { useComponentsQuery } from '../../hooks/useComponentsQuery';
import { useSecurityMetricsViewSettings } from '../../hooks/useShowTrendTotal';
import { useFetchComponentNamesFromSystem } from '../../hooks/useFetchComponentNames';
import { PageHeader } from '../shared/PageHeader';
import { MetricsGrid } from '../shared/MetricsGrid';

export const SystemPage = () => {
  const { entity } = useEntity();

  const { componentNames, componentNamesIsLoading, componentNamesError } =
    useFetchComponentNamesFromSystem(entity);

  const { showTotal, showOpen, toggleShowTotal, toggleShowOpen } =
    useSecurityMetricsViewSettings();

  const {
    data: overviewData,
    isPending: isOverviewPending,
    error: overviewError,
  } = useOverviewQuery(entity.metadata.name, componentNames);

  const {
    data: componentsData,
    isPending: isComponentsPending,
    error: componentsError,
  } = useComponentsQuery(entity.metadata.name, componentNames, true);

  const error = overviewError || componentsError;

  if (error || componentNamesError)
    return (
      <ErrorBanner
        errorTitle={`Kunne ikke hente metrikker for systemet ${entity.metadata.name}`}
        errorMessage={error ? error.message : componentNamesError?.message}
      />
    );

  if (componentNamesIsLoading || isOverviewPending || isComponentsPending)
    return <Progress />;

  const secrets: Secrets[] = (overviewData?.secrets ?? []).flatMap(s =>
    s.secrets.alerts.length > 0
      ? s.componentNames.map(name => ({
          componentName: name,
          alerts: s.secrets.alerts,
        }))
      : [],
  );
  const notPermitted = overviewData?.notPermittedComponents ?? [];

  return (
    <Stack gap={2}>
      <PageHeader
        entityName={entity.metadata.name}
        secrets={secrets}
        notPermitted={notPermitted}
        viewSettingsProps={{
          showTotal,
          showOpen,
          onToggleShowTotal: toggleShowTotal,
          onToggleShowOpen: toggleShowOpen,
        }}
      />

      <MetricsGrid>
        <SystemScannerStatuses data={overviewData?.scannerConfig ?? []} />
        <SystemRiscStatuses data={overviewData?.riscStatus ?? []} />
        <VulnerabilityCountsOverview
          severityCount={overviewData?.severityCount}
          openSeverityCount={overviewData?.openSeverityCount}
          showOpen={showOpen}
        />
        <Trend
          componentNames={componentNames}
          showTotal={showTotal}
          showOpen={showOpen}
        />
      </MetricsGrid>

      <RepositoriesTable
        data={componentsData?.components ?? []}
        showOpen={showOpen}
        notPermittedComponents={componentsData?.notPermittedComponents ?? []}
      />
    </Stack>
  );
};

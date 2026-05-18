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
import { useMetricsQuery } from '../../hooks/useMetricsQuery';
import {
  getAllNotPermittedComponents,
  getAllPermittedMetrics,
  getAllSecrets,
} from '../../mapping/getGroupedData';
import { RepositorySummary } from '../../typesFrontend';
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

  const { data, isPending, error } = useMetricsQuery(
    entity.metadata.name,
    componentNames,
  );

  if (error || componentNamesError)
    return (
      <ErrorBanner
        errorTitle={`Kunne ikke hente metrikker for systemet ${entity.metadata.name}`}
        errorMessage={error ? error.message : componentNamesError?.message}
      />
    );

  if (componentNamesIsLoading || isPending) return <Progress />;

  const secrets: Secrets[] = getAllSecrets(data);
  const permitted: RepositorySummary[] = getAllPermittedMetrics(data);
  const notPermitted: string[] = getAllNotPermittedComponents(data);

  return (
    <Stack gap={2}>
      <PageHeader
        entityName={entity.metadata.name}
        secrets={secrets}
        notPermitted={notPermitted}
        viewSettingsProps={{ showTotal, showOpen, onToggleShowTotal: toggleShowTotal, onToggleShowOpen: toggleShowOpen }}
      />

      <MetricsGrid>
        <SystemScannerStatuses data={permitted} />
        <SystemRiscStatuses data={permitted} />
        <VulnerabilityCountsOverview data={permitted} showOpen={showOpen} />
        <Trend
          componentNames={permitted.map(p => p.componentNames[0])}
          showTotal={showTotal}
          showOpen={showOpen}
        />
      </MetricsGrid>

      <RepositoriesTable
        data={permitted}
        showOpen={showOpen}
        notPermittedComponents={notPermitted}
      />
    </Stack>
  );
};

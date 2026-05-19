import { Progress } from '@backstage/core-components';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/system';
import { RepositoriesTable } from '../RepositoriesTable/RepositoriesTable';
import { SystemScannerStatuses } from '../ScannerStatus/SystemScannerStatuses';
import { Secrets, SecretsAlert } from '../SecretsOverview/SecretsAlert';
import { Trend } from '../Trend/Trend';
import { VulnerabilityCountsOverview } from '../VulnerabilityCounts/VulnerabilityCountsOverview';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ErrorBanner } from '../ErrorBanner';
import { useMetricsQuery } from '../../hooks/useMetricsQuery';
import {
  getAllNotPermittedComponents,
  getAllPermittedMetrics,
  getAllSecrets,
} from '../../mapping/getGroupedData';
import { RepositorySummary } from '../../typesFrontend';
import { NoAccessAlert } from '../NoAccessAlert';
import { useFetchComponentNamesFromSystem } from '../../hooks/useFetchComponentNames';
import { MetricsStatus } from '../MetricsStatus';
import { ViewSettingsButton } from '../ViewSettings/ViewSettingsButton';
import { useSecurityMetricsViewSettings } from '../../hooks/useShowTrendTotal';

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
      <Stack direction="row" alignItems="center" gap={2}>
        <MetricsStatus entityName={entity.metadata.name} />
        <Stack
          flexDirection="row"
          gap={2}
          flex={1}
          flexWrap="wrap"
          sx={{ '& > *': { flex: 1 } }}
        >
          <SecretsAlert secretsOverviewData={secrets} />
          {notPermitted.length > 0 && <NoAccessAlert repos={notPermitted} />}
        </Stack>
        <Box ml="auto" display="flex" alignItems="center" gap={0.5}>
          <ViewSettingsButton
            showTotal={showTotal}
            showOpen={showOpen}
            onToggleShowTotal={toggleShowTotal}
            onToggleShowOpen={toggleShowOpen}
          />
        </Box>
      </Stack>

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: '1fr',
          lg: '2fr 3fr 3fr',
        }}
        gap={2}
        gridAutoRows="minmax(320px, 1fr)"
      >
        <SystemScannerStatuses data={permitted} />
        <VulnerabilityCountsOverview data={permitted} showOpen={showOpen} />
        <Trend
          componentNames={permitted.map(p => p.componentNames[0])}
          showTotal={showTotal}
          showOpen={showOpen}
        />
      </Box>

      <RepositoriesTable
        data={permitted}
        showOpen={showOpen}
        notPermittedComponents={notPermitted}
      />
    </Stack>
  );
};

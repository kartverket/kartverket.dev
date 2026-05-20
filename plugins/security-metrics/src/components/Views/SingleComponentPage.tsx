import { Progress } from '@backstage/core-components';
import { useState } from 'react';
import { Box } from '@mui/system';
import { getSecrets } from '../../mapping/getSecretsData';
import { ComponentScannerStatus } from '../ScannerStatus/ComponentScannerStatus';
import { Trend } from '../Trend/Trend';
import { VulnerabilityCountsOverview } from '../VulnerabilityCounts/VulnerabilityCountsOverview';
import { VulnerabilityTable } from '../VulnerabilityTable/VulnerabilityTable';
import Stack from '@mui/material/Stack';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useComponentMetricsQuery } from '../../hooks/useComponentMetricsQuery';
import { ErrorBanner } from '../shared/ErrorBanner';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { RuntimeVulnerabilityTable } from '../VulnerabilityTable/RuntimeVulnerabilityTable';
import { getScannerStatusData } from '../../mapping/getScannerData';
import { ComponentRiscStatus } from '../RiscStatus/ComponentRiscStatus';
import { useSecurityMetricsViewSettings } from '../../hooks/useShowTrendTotal';
import { PageHeader } from '../shared/PageHeader';
import { MetricsGrid } from '../shared/MetricsGrid';

enum TabEnum {
  ALL_VULNERABILITIES = 0,
  RUNTIME_VULNERABILITIES = 1,
}

export const SingleComponentPage = () => {
  const { entity } = useEntity();
  const componentName = entity.metadata.name;

  const { data, isPending, error } = useComponentMetricsQuery(componentName);

  const { showTotal, showOpen, toggleShowTotal, toggleShowOpen } =
    useSecurityMetricsViewSettings();
  const [selectedTab, setSelectedTab] = useState<TabEnum>(0);
  const handleTabChange = (_: React.SyntheticEvent, newValue: TabEnum) => {
    setSelectedTab(newValue);
  };

  if (error)
    return (
      <ErrorBanner
        errorTitle={`Kunne ikke hente metrikker for ${entity.metadata.name}`}
        errorMessage={error.message}
      />
    );

  if (isPending) return <Progress />;

  const secrets = getSecrets(data);
  const [scannerStatus] = getScannerStatusData(data);

  return (
    <Stack gap={2}>
      <PageHeader
        entityName={componentName}
        secrets={secrets}
        viewSettingsProps={{
          showTotal,
          showOpen,
          onToggleShowTotal: toggleShowTotal,
          onToggleShowOpen: toggleShowOpen,
        }}
      />
      <MetricsGrid>
        <ComponentScannerStatus scannerStatus={scannerStatus} />
        <ComponentRiscStatus riscStatus={data.riscStatus} />
        <VulnerabilityCountsOverview
          data={data}
          showOpen={showOpen}
          averageDays={data.averageTimeToSolveVulnerabilityDays}
        />
        <Trend
          componentNames={componentName}
          showTotal={showTotal}
          showOpen={showOpen}
        />
      </MetricsGrid>

      {data.vulnerabilities.length > 0 && (
        <Box>
          {!data.scannerConfig.sysdig ? (
            <VulnerabilityTable
              vulnerabilities={data.vulnerabilities}
              componentName={componentName}
              initialRowsPerPage={10}
            />
          ) : (
            <>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                sx={{ mb: 1 }}
              >
                <Tab label="Sårbarheter" />
                <Tab label="Sårbarheter i kjøretidsmiljø" />
              </Tabs>
              {selectedTab === TabEnum.ALL_VULNERABILITIES && (
                <VulnerabilityTable
                  vulnerabilities={data.vulnerabilities}
                  componentName={componentName}
                  initialRowsPerPage={10}
                />
              )}
              {selectedTab === TabEnum.RUNTIME_VULNERABILITIES && (
                <RuntimeVulnerabilityTable
                  vulnerabilities={data.vulnerabilities}
                  componentName={componentName}
                />
              )}
            </>
          )}
        </Box>
      )}
    </Stack>
  );
};

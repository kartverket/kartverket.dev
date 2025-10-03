import { Progress, SupportButton } from '@backstage/core-components';
import { Box } from '@mui/system';
import { useState } from 'react';
import { getSecrets } from '../../mapping/getSecretsData';
import { ComponentScannerStatus } from '../ScannerStatus/ComponentScannerStatus';
import { SecretsAlert } from '../SecretsOverview/SecretsAlert';
import { Trend } from '../Trend/Trend';
import { VulnerabilityCountsOverview } from '../VulnerabilityCounts/VulnerabilityCountsOverview';
import { VulnerabilityTable } from '../VulnerabilityTable/VulnerabilityTable';
import { ComponentRosStatus } from '../RosStatus/ComponentRosStatus';
import Stack from '@mui/material/Stack';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useComponentMetricsQuery } from '../../hooks/useComponentMetricsQuery';
import { ErrorBanner } from '../ErrorBanner';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { RuntimeVulnerabilityTable } from '../VulnerabilityTable/RuntimeVulnerabilityTable';
import { getScannerStatusData } from '../../mapping/getScannerData';

enum TabEnum {
  ALL_VULNERABILITIES = 0,
  RUNTIME_VULNERABILITIES = 1,
}

export const SingleComponentPage = () => {
  const { entity } = useEntity();
  const componentName = entity.metadata.name;

  const { data, isPending, error } = useComponentMetricsQuery(componentName);

  const [selectedTab, setSelectedTab] = useState<TabEnum>(0);
  const handleTabChange = (_: React.SyntheticEvent, newValue: TabEnum) => {
    setSelectedTab(newValue);
  };

  if (error)
    return (
      <ErrorBanner
        errorTitle={`Kunne ikke hente ${error ? 'metrikker' : 'reponavn'} for ${entity.metadata.name}`}
        errorMessage={error.message}
      />
    );

  if (isPending) return <Progress />;

  const secrets = getSecrets(data);
  const [scannerStatus] = getScannerStatusData(data);

  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="center" gap={2}>
        {secrets.length > 0 && (
          <Box flex={1}>
            <SecretsAlert secretsOverviewData={secrets} />
          </Box>
        )}
        <Box ml="auto">
          <SupportButton />
        </Box>
      </Stack>
      <Box
        display="grid"
        gridTemplateColumns={{
          sm: '1fr',
          md: '1fr 1fr',
          xl: '1fr 1fr 2fr 2fr',
        }}
        gap={2}
        gridAutoRows="minmax(320px, 1fr)"
      >
        <ComponentScannerStatus scannerStatus={scannerStatus} />
        <ComponentRosStatus
          repositoryName={componentName}
          rosStatus={data.rosStatus}
        />
        <VulnerabilityCountsOverview data={data} />
        <Trend componentNames={componentName} />
      </Box>

      {data.vulnerabilities.length > 0 && (
        <Box>
          {!data.scannerConfig.sysdig ? (
            <VulnerabilityTable
              vulnerabilities={data.vulnerabilities}
              componentName={componentName}
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

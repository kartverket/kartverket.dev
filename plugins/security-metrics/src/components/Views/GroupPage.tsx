import { Progress, SupportButton } from '@backstage/core-components';
import { Box } from '@mui/system';
import { useState } from 'react';
import { RepositoriesTable } from '../RepositoriesTable/RepositoriesTable';
import { SystemScannerStatuses } from '../ScannerStatus/SystemScannerStatuses';
import { Secrets, SecretsAlert } from '../SecretsOverview/SecretsAlert';
import { Trend } from '../Trend/Trend';
import { VulnerabilityCountsOverview } from '../VulnerabilityCounts/VulnerabilityCountsOverview';
import Stack from '@mui/material/Stack';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ErrorBanner } from '../ErrorBanner';
import { RepositorySummary } from '../../typesFrontend';
import {
  getAllNotPermittedComponents,
  getAllPermittedMetrics,
  getAllSecrets,
} from '../../mapping/getGroupedData';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SystemsTable } from '../SystemsTable/SystemsTable';
import { useMetricsQuery } from '../../hooks/useMetricsQuery';
import { useFetchComponentNamesByGroup } from '../../hooks/useFetchRepositoryNames';
import NoAccessAlert from '../NoAccessAlert';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import { SlackNotificationDialog } from '../SlackNotificationsDialog';

enum TabEnum {
  COMPONENT = 0,
  SYSTEM = 1,
}

export const GroupPage = () => {
  const { entity } = useEntity();
  const [openNotificationsDialog, setOpenNotificationsDialog] = useState(false);
  const [channel, setChannel] = useState('');

  const { componentNames, componentNamesIsLoading, componentNamesError } =
    useFetchComponentNamesByGroup(entity);

  const { data, isPending, error } = useMetricsQuery(componentNames);

  const [selectedTab, setSelectedTab] = useState<TabEnum>(0);
  const handleTabChange = (_: React.SyntheticEvent, newValue: TabEnum) => {
    setSelectedTab(newValue);
  };

  if (error || componentNamesError)
    return (
      <ErrorBanner
        errorTitle={`Kunne ikke hente ${error ? 'metrikker' : 'reponavn'} for ${entity.metadata.name}`}
        errorMessage={error ? error.message : componentNamesError?.message}
      />
    );

  if (componentNamesIsLoading || isPending) return <Progress />;

  const secrets: Secrets[] = getAllSecrets(data);
  const permitted: RepositorySummary[] = getAllPermittedMetrics(data);
  const notPermitted: string[] = getAllNotPermittedComponents(data);

  const handleOpenNotificationsDialog = () => {
    setOpenNotificationsDialog(true);
  };

  const handleCloseNotificationsDialog = () => {
    setOpenNotificationsDialog(false);
  };

  return (
    <Stack gap={2}>
      <Stack flexDirection="row">
        <Stack
          flexDirection="row"
          gap={2}
          flex={1}
          flexWrap="wrap"
          sx={{
            '& > *': {
              flex: 1,
            },
          }}
        >
          <SecretsAlert secretsOverviewData={secrets} />
          {notPermitted.length > 0 && <NoAccessAlert repos={notPermitted} />}
        </Stack>
        <Button
          variant="text"
          sx={{ ml: 2 }}
          startIcon={<SettingsIcon />}
          color="primary"
          onClick={handleOpenNotificationsDialog}
        >
          Konfigurer varsling
        </Button>
        <SlackNotificationDialog
          openNotificationsDialog={openNotificationsDialog}
          handleCloseNotificationsDialog={handleCloseNotificationsDialog}
          channel={channel}
          setChannel={setChannel}
          componentNames={componentNames}
        />
        <SupportButton />
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
        <VulnerabilityCountsOverview data={permitted} />
        <Trend
          componentNames={permitted.map(component => component.componentName)}
        />
      </Box>

      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 1 }}>
        <Tab label="Metrikker per komponent" />
        <Tab label="Metrikker per system" />
      </Tabs>
      {selectedTab === TabEnum.COMPONENT && (
        <RepositoriesTable
          data={permitted}
          notPermittedComponents={notPermitted}
        />
      )}
      {selectedTab === TabEnum.SYSTEM && <SystemsTable data={data} />}
    </Stack>
  );
};

import { Progress, SupportButton } from '@backstage/core-components';
import { Box } from '@mui/system';
import { useState } from 'react';
import { RepositoriesTable } from '../RepositoriesTable/RepositoriesTable';
import { SystemScannerStatuses } from '../ScannerStatus/SystemScannerStatuses';
import { Secrets, SecretsAlert } from '../SecretsOverview/SecretsAlert';
import { Trend } from '../Trend/Trend';
import { VulnerabilityCountsOverview } from '../VulnerabilityCounts/VulnerabilityCountsOverview';
import Stack from '@mui/material/Stack';
import { useEntity, useStarredEntities } from '@backstage/plugin-catalog-react';
import { ErrorBanner } from '../ErrorBanner';
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
import { useStarredRefFilter } from '../../hooks/useStarredRefFilter';
import { RepositorySummary } from '../../typesFrontend';
import { StarFilterButton } from '../StarFilterButton';
import { filterSystemsByComponents } from '../utils';

enum TabEnum {
  COMPONENT = 0,
  SYSTEM = 1,
}

export const GroupPage = () => {
  const { entity } = useEntity();
  const [openNotificationsDialog, setOpenNotificationsDialog] = useState(false);
  const [channel, setChannel] = useState('');
  const { starredEntities } = useStarredEntities();
  const [selectedTab, setSelectedTab] = useState<TabEnum>(TabEnum.COMPONENT);

  const { componentNames, componentNamesIsLoading, componentNamesError } =
    useFetchComponentNamesByGroup(entity);
  const { data, isPending, error } = useMetricsQuery(componentNames);

  const permitted: RepositorySummary[] = getAllPermittedMetrics(data ?? []);
  const notPermitted: string[] = getAllNotPermittedComponents(data ?? []);

  const permittedWithRef = permitted.map(p => ({
    ...p,
    ref: `component:default/${p.componentName}`,
  }));

  const { hasStarred, effectiveFilter, visibleRefs, setFilterChoice } =
    useStarredRefFilter({
      allRefs: permittedWithRef.map(p => p.ref),
      starredEntities,
    });

  const filteredPermitted = permittedWithRef.filter(p =>
    visibleRefs.has(p.ref),
  );

  const filteredComponentNames = new Set(
    filteredPermitted.map(c => c.componentName),
  );

  if (error || componentNamesError)
    return (
      <ErrorBanner
        errorTitle={`Kunne ikke hente ${error ? 'metrikker' : 'reponavn'} for ${entity.metadata.name}`}
        errorMessage={error ? error.message : componentNamesError?.message}
      />
    );

  if (componentNamesIsLoading || isPending) return <Progress />;

  const filteredSystemsData = filterSystemsByComponents(
    data,
    filteredComponentNames,
    effectiveFilter,
  );

  const secrets: Secrets[] = getAllSecrets(data);

  const handleOpenNotificationsDialog = () => {
    setOpenNotificationsDialog(true);
  };

  const handleCloseNotificationsDialog = () => {
    setOpenNotificationsDialog(false);
  };

  return (
    <Stack gap={2}>
      <Stack flexDirection="row" alignItems="center">
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
        <Box display="flex" alignItems="center" mr={2} ml={2}>
          <StarFilterButton
            hasStarred={hasStarred}
            effectiveFilter={effectiveFilter}
            onToggle={() =>
              setFilterChoice(prev => (prev === 'starred' ? 'all' : 'starred'))
            }
          />
        </Box>
        <Button
          variant="text"
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
          notPermitted={notPermitted}
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
        <SystemScannerStatuses data={filteredPermitted} />
        <VulnerabilityCountsOverview data={filteredPermitted} />
        <Trend
          componentNames={filteredPermitted.map(
            component => component.componentName,
          )}
        />
      </Box>

      <Tabs
        value={selectedTab}
        onChange={(_, v) => setSelectedTab(v)}
        sx={{ mb: 1 }}
      >
        <Tab label="Metrikker per komponent" value={TabEnum.COMPONENT} />
        <Tab label="Metrikker per system" value={TabEnum.SYSTEM} />
      </Tabs>

      {selectedTab === TabEnum.COMPONENT && (
        <RepositoriesTable
          data={filteredPermitted}
          notPermittedComponents={notPermitted}
        />
      )}
      {selectedTab === TabEnum.SYSTEM && filteredSystemsData && (
        <SystemsTable data={filteredSystemsData} />
      )}
    </Stack>
  );
};

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
import TuneIcon from '@mui/icons-material/Tune';
import { SlackNotificationDialog } from '../SlackNotificationsDialog';
import { useStarredRefFilter } from '../../hooks/useStarredRefFilter';
import { RepositorySummary } from '../../typesFrontend';
import { filterSystemsByComponents } from '../utils';
import { useShowTrendTotal } from '../../hooks/useShowTrendTotal';
import { ViewSettingsDialog } from '../ViewSettingsDialog';
import SettingsIcon from '@mui/icons-material/Settings';

enum TabEnum {
  COMPONENT = 0,
  SYSTEM = 1,
}

export const GroupPage = () => {
  const { entity } = useEntity();
  const { starredEntities } = useStarredEntities();

  const [openNotificationsDialog, setOpenNotificationsDialog] = useState(false);
  const [openViewSettings, setOpenViewSettings] = useState(false);
  const [channel, setChannel] = useState('');
  const [selectedTab, setSelectedTab] = useState<TabEnum>(TabEnum.COMPONENT);

  const { showTotal, toggleShowTotal } = useShowTrendTotal();

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

  const permittedComponents = filteredPermitted.map(c => c.componentName);
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
        <Box display="flex" alignItems="center" mr={0.5} ml={2}>
          <Button
            variant="text"
            startIcon={<TuneIcon />}
            color="primary"
            onClick={() => setOpenViewSettings(true)}
          >
            Tilpass visning
          </Button>
          <ViewSettingsDialog
            open={openViewSettings}
            onClose={() => setOpenViewSettings(false)}
            starFilter={{
              hasStarred,
              effectiveFilter,
              onToggleStarFilter: () =>
                setFilterChoice(prev =>
                  prev === 'starred' ? 'all' : 'starred',
                ),
            }}
            showTotal={showTotal}
            onToggleShowTotal={toggleShowTotal}
          />
        </Box>
        <Button
          variant="text"
          startIcon={<SettingsIcon />}
          color="primary"
          onClick={() => setOpenNotificationsDialog(true)}
        >
          Konfigurer varsling
        </Button>
        <SlackNotificationDialog
          openNotificationsDialog={openNotificationsDialog}
          handleCloseNotificationsDialog={() =>
            setOpenNotificationsDialog(false)
          }
          channel={channel}
          setChannel={setChannel}
          permittedComponents={permittedComponents}
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
        <Trend componentNames={permittedComponents} showTotal={showTotal} />
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

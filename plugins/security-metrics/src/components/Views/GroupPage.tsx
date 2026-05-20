import { Progress, SupportButton } from '@backstage/core-components';
import { useState } from 'react';
import { RepositoriesTable } from '../RepositoriesTable/RepositoriesTable';
import { SystemScannerStatuses } from '../ScannerStatus/SystemScannerStatuses';
import { Secrets } from '../SecretsOverview/SecretsAlert';
import { Trend } from '../Trend/Trend';
import { VulnerabilityCountsOverview } from '../VulnerabilityCounts/VulnerabilityCountsOverview';
import { SystemRiscStatuses } from '../RiscStatus/SystemRiscStatuses';
import Stack from '@mui/material/Stack';
import { useEntity, useStarredEntities } from '@backstage/plugin-catalog-react';
import { ErrorBanner } from '../shared/ErrorBanner';
import {
  getAllNotPermittedComponents,
  getAllPermittedMetrics,
  getAllSecrets,
} from '../../mapping/getGroupedData';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SystemsTable } from '../SystemsTable/SystemsTable';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import { SlackNotificationDialog } from '../SlackNotificationsDialog';
import { useStarredRefFilter } from '../../hooks/useStarredRefFilter';
import { RepositorySummary } from '../../typesFrontend';
import { filterSystemsByComponents } from '../../utils/utils';
import { useSecurityMetricsViewSettings } from '../../hooks/useShowTrendTotal';
import Alert from '@mui/material/Alert';
import { useGroupMetrics } from '../../hooks/useGroupMetrics';
import { VulnerabilityOverviewTable } from '../VulnerabilityOverviewTable/VulnerabilityOverviewTable';
import { PageHeader } from '../shared/PageHeader';
import { MetricsGrid } from '../shared/MetricsGrid';
import { OwnerTable } from '../OwnerTable/OwnerTable';

enum TabEnum {
  COMPONENT = 0,
  SYSTEM = 1,
  OWNER = 2,
  VULNERABILITIES = 3,
}

export const GroupPage = () => {
  const { entity } = useEntity();
  const { starredEntities } = useStarredEntities();

  const [openNotificationsDialog, setOpenNotificationsDialog] = useState(false);
  const [channel, setChannel] = useState('');
  const [selectedTab, setSelectedTab] = useState<TabEnum>(TabEnum.COMPONENT);

  const { showTotal, showOpen, toggleShowTotal, toggleShowOpen } =
    useSecurityMetricsViewSettings();

  const { data, isLoading, isEmpty, error, errorTitle } =
    useGroupMetrics(entity);

  const permitted: RepositorySummary[] = data
    ? getAllPermittedMetrics(data)
    : [];
  const notPermitted: string[] = data ? getAllNotPermittedComponents(data) : [];
  const secrets: Secrets[] = data ? getAllSecrets(data) : [];
  const aggregatedVulnerabilities =
    data?.vulnerabilityOverview?.vulnerabilities ?? [];

  const allComponentRefs = permitted.flatMap(p =>
    p.componentNames.map(n => `component:default/${n}`),
  );

  const { hasStarred, effectiveFilter, visibleRefs, setFilterChoice } =
    useStarredRefFilter({
      allRefs: allComponentRefs,
      starredEntities,
    });

  const filteredPermitted = permitted.filter(p =>
    p.componentNames.some(n => visibleRefs.has(`component:default/${n}`)),
  );

  const filteredSystemsData = filterSystemsByComponents(
    data?.systems ?? [],
    new Set(filteredPermitted.map(c => c.repoName)),
    effectiveFilter,
  );

  if (isLoading) return <Progress />;

  if (error) {
    return <ErrorBanner errorTitle={errorTitle} errorMessage={error.message} />;
  }

  if (isEmpty) {
    return (
      <Alert severity="info">
        Finner ingen komponenter som har sikkerhetsmetrikker
      </Alert>
    );
  }

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
          starFilter: {
            hasStarred,
            effectiveFilter,
            onToggleStarFilter: () =>
              setFilterChoice(prev => (prev === 'starred' ? 'all' : 'starred')),
          },
        }}
        rightActions={
          <>
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
              permittedComponents={filteredPermitted.flatMap(
                c => c.componentNames,
              )}
              notPermitted={notPermitted}
            />
            <SupportButton />
          </>
        }
      />

      <MetricsGrid>
        <SystemScannerStatuses data={filteredPermitted} />
        <SystemRiscStatuses data={filteredPermitted} />
        <VulnerabilityCountsOverview
          data={filteredPermitted}
          showOpen={showOpen}
        />
        <Trend
          componentNames={filteredPermitted.map(c => c.componentNames[0])}
          showTotal={showTotal}
          showOpen={showOpen}
        />
      </MetricsGrid>

      <Tabs
        value={selectedTab}
        onChange={(_, v) => setSelectedTab(v)}
        sx={{ mb: 1 }}
      >
        <Tab label="Metrikker per komponent" value={TabEnum.COMPONENT} />
        <Tab label="Metrikker per system" value={TabEnum.SYSTEM} />
        {entity.spec?.type !== 'team' && (
          <Tab label="Metrikker per eier" value={TabEnum.OWNER} />
        )}
        <Tab label="Unike sårbarheter" value={TabEnum.VULNERABILITIES} />
      </Tabs>

      {selectedTab === TabEnum.VULNERABILITIES && (
        <VulnerabilityOverviewTable data={aggregatedVulnerabilities} />
      )}

      {selectedTab === TabEnum.COMPONENT && (
        <RepositoriesTable
          data={filteredPermitted}
          showOpen={showOpen}
          notPermittedComponents={notPermitted}
        />
      )}
      {selectedTab === TabEnum.SYSTEM && filteredSystemsData && (
        <SystemsTable data={filteredSystemsData} showOpen={showOpen} />
      )}

      {selectedTab === TabEnum.OWNER && (
        <OwnerTable
          onNavigate={() => {
            setSelectedTab(TabEnum.COMPONENT);
          }}
        />
      )}

      {selectedTab === TabEnum.OWNER && (
        <OwnerTable
          onNavigate={() => {
            setSelectedTab(TabEnum.COMPONENT);
          }}
        />
      )}
    </Stack>
  );
};

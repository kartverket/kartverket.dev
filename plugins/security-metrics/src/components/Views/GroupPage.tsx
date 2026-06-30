import { Progress, SupportButton } from '@backstage/core-components';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RepositoriesTable } from '../RepositoriesTable/RepositoriesTable';
import { SystemScannerStatuses } from '../ScannerStatus/SystemScannerStatuses';
import { Secrets } from '../SecretsOverview/SecretsAlert';
import { Trend } from '../Trend/Trend';
import { VulnerabilityCountsOverview } from '../VulnerabilityCounts/VulnerabilityCountsOverview';
import { SystemRiscStatuses } from '../RiscStatus/SystemRiscStatuses';
import Stack from '@mui/material/Stack';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ErrorBanner } from '../shared/ErrorBanner';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SystemsTable } from '../SystemsTable/SystemsTable';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import { SlackNotificationDialog } from '../SlackNotificationsDialog';
import { useSecurityMetricsViewSettings } from '../../hooks/useShowTrendTotal';
import Alert from '@mui/material/Alert';
import { useGroupMetrics } from '../../hooks/useGroupMetrics';
import { useComponentsQuery } from '../../hooks/useComponentsQuery';
import { useSystemsQuery } from '../../hooks/useSystemsQuery';
import { UniqueVulnerabilitiesTable } from '../UniqueVulnerabilitiesTable/UniqueVulnerabilitiesTable';
import { PageHeader } from '../shared/PageHeader';
import { MetricsGrid } from '../shared/MetricsGrid';
import { OwnerTable } from '../OwnerTable/OwnerTable';

enum TabEnum {
  COMPONENT = 0,
  SYSTEM = 1,
  OWNER = 2,
  VULNERABILITIES = 3,
}

const TAB_SLUGS: Record<TabEnum, string> = {
  [TabEnum.COMPONENT]: 'komponent',
  [TabEnum.SYSTEM]: 'system',
  [TabEnum.OWNER]: 'eier',
  [TabEnum.VULNERABILITIES]: 'saarbarheter',
};

const SLUG_TO_TAB = new Map(
  Object.entries(TAB_SLUGS).map(([k, v]) => [v, Number(k) as TabEnum]),
);

const slugToTab = (slug: string | null): TabEnum =>
  SLUG_TO_TAB.get(slug ?? '') ?? TabEnum.COMPONENT;

export const GroupPage = () => {
  const { entity } = useEntity();
  const [searchParams, setSearchParams] = useSearchParams();

  const resolvedTab = slugToTab(searchParams.get('tab'));
  const selectedTab =
    resolvedTab === TabEnum.OWNER && entity.spec?.type === 'team'
      ? TabEnum.COMPONENT
      : resolvedTab;

  const handleTabChange = (_: React.SyntheticEvent, newTab: TabEnum) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', TAB_SLUGS[newTab]);
    setSearchParams(next, { replace: true });
  };

  const [openNotificationsDialog, setOpenNotificationsDialog] = useState(false);
  const [channel, setChannel] = useState('');

  const { showTotal, showOpen, toggleShowTotal, toggleShowOpen } =
    useSecurityMetricsViewSettings();

  const {
    data,
    componentNames,
    uniqueVulnerabilitiesData,
    isUniqueVulnerabilitiesLoading,
    uniqueVulnerabilitiesError,
    isLoading,
    isEmpty,
    error,
    errorTitle,
  } = useGroupMetrics(entity, selectedTab === TabEnum.VULNERABILITIES);

  const {
    data: componentsData,
    isPending: isComponentsLoading,
    error: componentsError,
  } = useComponentsQuery(
    entity.metadata.name,
    componentNames,
    selectedTab === TabEnum.COMPONENT,
  );

  const {
    data: systemsData,
    isPending: isSystemsLoading,
    error: systemsError,
  } = useSystemsQuery(
    entity.metadata.name,
    componentNames,
    selectedTab === TabEnum.SYSTEM,
  );

  const notPermitted = data?.notPermittedComponents ?? [];
  const secrets: Secrets[] = (data?.secrets ?? []).flatMap(s =>
    s.secrets.alerts.length > 0
      ? s.componentNames.map(name => ({
          componentName: name,
          alerts: s.secrets.alerts,
        }))
      : [],
  );
  const aggregatedVulnerabilities =
    uniqueVulnerabilitiesData?.vulnerabilities ?? [];

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
              permittedComponents={componentNames}
              notPermitted={notPermitted}
            />
            <SupportButton />
          </>
        }
      />

      <MetricsGrid>
        <SystemScannerStatuses data={data?.scannerConfig ?? []} />
        <SystemRiscStatuses data={data?.riscStatus ?? []} />
        <VulnerabilityCountsOverview
          severityCount={data?.severityCount}
          openSeverityCount={data?.openSeverityCount}
          showOpen={showOpen}
        />
        <Trend
          componentNames={componentNames}
          showTotal={showTotal}
          showOpen={showOpen}
        />
      </MetricsGrid>

      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 1 }}>
        <Tab label="Metrikker per komponent" value={TabEnum.COMPONENT} />
        <Tab label="Metrikker per system" value={TabEnum.SYSTEM} />
        {entity.spec?.type !== 'team' && (
          <Tab label="Metrikker per eier" value={TabEnum.OWNER} />
        )}
        <Tab label="Unike sårbarheter" value={TabEnum.VULNERABILITIES} />
      </Tabs>

      {selectedTab === TabEnum.VULNERABILITIES &&
        isUniqueVulnerabilitiesLoading && <Progress />}
      {selectedTab === TabEnum.VULNERABILITIES &&
        uniqueVulnerabilitiesError && (
          <ErrorBanner
            errorTitle={`Kunne ikke hente sårbarhetsoversikt for ${entity.metadata.name}`}
            errorMessage={uniqueVulnerabilitiesError.message}
          />
        )}
      {selectedTab === TabEnum.VULNERABILITIES &&
        !isUniqueVulnerabilitiesLoading &&
        !uniqueVulnerabilitiesError && (
          <>
            {showOpen && (
              <Alert severity="info">
                Viser alle sårbarheter, ikke bare åpne
              </Alert>
            )}
            <UniqueVulnerabilitiesTable data={aggregatedVulnerabilities} />
          </>
        )}

      {selectedTab === TabEnum.COMPONENT && isComponentsLoading && <Progress />}
      {selectedTab === TabEnum.COMPONENT && componentsError && (
        <ErrorBanner
          errorTitle={`Kunne ikke hente komponentmetrikker for ${entity.metadata.name}`}
          errorMessage={componentsError.message}
        />
      )}
      {selectedTab === TabEnum.COMPONENT &&
        componentsData &&
        !isComponentsLoading && (
          <RepositoriesTable
            data={componentsData.components}
            showOpen={showOpen}
            notPermittedComponents={componentsData.notPermittedComponents}
          />
        )}

      {selectedTab === TabEnum.SYSTEM && isSystemsLoading && <Progress />}
      {selectedTab === TabEnum.SYSTEM && systemsError && (
        <ErrorBanner
          errorTitle={`Kunne ikke hente systemmetrikker for ${entity.metadata.name}`}
          errorMessage={systemsError.message}
        />
      )}
      {selectedTab === TabEnum.SYSTEM && systemsData && !isSystemsLoading && (
        <SystemsTable data={systemsData} showOpen={showOpen} />
      )}

      {selectedTab === TabEnum.OWNER && (
        <OwnerTable showOpen={showOpen} showTotal={showTotal} />
      )}
    </Stack>
  );
};

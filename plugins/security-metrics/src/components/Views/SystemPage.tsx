import { Progress, SupportButton } from '@backstage/core-components';
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
  Entity,
  parseEntityRef,
  RELATION_HAS_PART,
} from '@backstage/catalog-model';
import {
  getAllNotPermittedComponents,
  getAllPermittedMetrics,
  getAllSecrets,
} from '../../mapping/getGroupedData';
import { RepositorySummary } from '../../typesFrontend';
import NoAccessAlert from '../NoAccessAlert';
import { useShowTrendTotal } from '../../hooks/useShowTrendTotal';
import { ViewSettingsDialog } from '../ViewSettingsDialog';
import TuneIcon from '@mui/icons-material/Tune';
import Button from '@mui/material/Button';
import { useState } from 'react';

export function getComponentNamesFromSystem(system: Entity) {
  const rels = system.relations ?? [];

  const componentNames = rels
    .filter(r => r.type === RELATION_HAS_PART)
    .map(r => parseEntityRef(r.targetRef))
    .filter(ref => (ref.kind ?? '').toLowerCase() === 'component')
    .map(ref => ref.name);

  return componentNames;
}

export const SystemPage = () => {
  const { entity: system } = useEntity();

  const componentNames = getComponentNamesFromSystem(system);

  const { showTotal, toggleShowTotal } = useShowTrendTotal();
  const [openViewSettings, setOpenViewSettings] = useState(false);

  const { data, isPending, error } = useMetricsQuery(componentNames);

  if (error)
    return (
      <ErrorBanner
        errorTitle={`Kunne ikke hente metrikker for systemet ${system.metadata.name}`}
        errorMessage={error.message}
      />
    );

  if (isPending) return <Progress />;

  const secrets: Secrets[] = getAllSecrets(data);
  const permitted: RepositorySummary[] = getAllPermittedMetrics(data);
  const notPermitted: string[] = getAllNotPermittedComponents(data);

  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="center" gap={2}>
        <Box flex={1}>
          <SecretsAlert secretsOverviewData={secrets} />
          {notPermitted.length > 0 && <NoAccessAlert repos={notPermitted} />}
        </Box>
        <Box ml="auto" display="flex" alignItems="center" gap={1}>
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
            showTotal={showTotal}
            onToggleShowTotal={toggleShowTotal}
          />
          <SupportButton />
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
        <VulnerabilityCountsOverview data={permitted} />
        <Trend componentNames={componentNames} showTotal={showTotal} />
      </Box>

      <RepositoriesTable
        data={permitted}
        notPermittedComponents={notPermitted}
      />
    </Stack>
  );
};

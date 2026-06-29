import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { OwnerSeverityCounts } from '../../typesFrontend';
import { useGroupInfo } from '../../hooks/useUserInfo';
import { SystemScannerStatuses } from '../ScannerStatus/SystemScannerStatuses';
import { SystemRiscStatuses } from '../RiscStatus/SystemRiscStatuses';
import { VulnerabilityCountsOverview } from '../VulnerabilityCounts/VulnerabilityCountsOverview';
import { OwnerTrendGraph } from '../Trend/OwnerTrendGraph';
import { MetricsGrid } from '../shared/MetricsGrid';

interface OwnerMetricsSectionProps {
  ownerMetrics: OwnerSeverityCounts;
  showTotal: boolean;
  showOpen: boolean;
  yAxisMax?: number;
}

export const OwnerMetricsSection = ({
  ownerMetrics,
  showTotal,
  showOpen,
  yAxisMax,
}: OwnerMetricsSectionProps) => {
  const { data: group, isLoading: isGroupLoading } = useGroupInfo(
    ownerMetrics.owner,
  );

  const rawName = group?.metadata?.name ?? ownerMetrics.owner;
  const displayName = `Team ${rawName.charAt(0).toUpperCase() + rawName.slice(1)}`;

  return (
    <Stack gap={2}>
      {isGroupLoading ? (
        <Skeleton variant="text" width={200} height={32} />
      ) : (
        <Typography variant="h6" fontWeight={600}>
          {displayName}
        </Typography>
      )}
      <MetricsGrid>
        <SystemScannerStatuses data={ownerMetrics.overview.scannerConfig} />
        <SystemRiscStatuses data={ownerMetrics.overview.riscStatus} />
        <VulnerabilityCountsOverview
          severityCount={ownerMetrics.overview.severityCount}
          openSeverityCount={ownerMetrics.overview.openSeverityCount}
          showOpen={showOpen}
        />
        <OwnerTrendGraph
          trendData={ownerMetrics.lastMonthSeverityCount}
          showTotal={showTotal}
          showOpen={showOpen}
          yAxisMax={yAxisMax}
        />
      </MetricsGrid>
    </Stack>
  );
};

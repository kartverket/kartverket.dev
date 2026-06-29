import { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useOwnerMetrics } from '../../hooks/useOwnerMetrics';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Progress } from '@backstage/core-components';
import Alert from '@mui/material/Alert';
import { ErrorBanner } from '../shared/ErrorBanner';
import { OwnerMetricsSection } from './OwnerMetricsSection';
import { getTotalVulnerabilityCount } from '../../mapping/getSeverityCounts';
import { TrendSeverityCounts } from '../../typesFrontend';

const getMaxTrendValue = (
  trendData: TrendSeverityCounts[],
  showOpen: boolean,
  showTotal: boolean,
): number => {
  if (trendData.length === 0) return 0;

  return trendData.reduce((max, count) => {
    if (showOpen) {
      const critical = count.openCritical ?? 0;
      const high = count.openHigh ?? 0;
      let pointMax = Math.max(critical, high);
      if (showTotal) {
        const total =
          (count.openUnknown ?? 0) +
          (count.openNegligible ?? 0) +
          (count.openLow ?? 0) +
          (count.openMedium ?? 0) +
          (count.openHigh ?? 0) +
          (count.openCritical ?? 0);
        pointMax = Math.max(pointMax, total);
      }
      return Math.max(max, pointMax);
    }

    let pointMax = Math.max(count.critical, count.high);
    if (showTotal) {
      const total =
        count.unknown +
        count.negligible +
        count.low +
        count.medium +
        count.high +
        count.critical;
      pointMax = Math.max(pointMax, total);
    }
    return Math.max(max, pointMax);
  }, 0);
};

export const OwnerTable = ({
  showOpen,
  showTotal,
}: {
  showOpen: boolean;
  showTotal: boolean;
}) => {
  const { entity } = useEntity();

  const { data, isLoading, isEmpty, error, errorTitle } =
    useOwnerMetrics(entity);

  const sortedOwners = useMemo(() => {
    if (!data?.permittedOwnerMetrics) return [];
    return [...data.permittedOwnerMetrics].sort((a, b) => {
      const aCount = getTotalVulnerabilityCount(
        showOpen ? a.overview.openSeverityCount : a.overview.severityCount,
      );
      const bCount = getTotalVulnerabilityCount(
        showOpen ? b.overview.openSeverityCount : b.overview.severityCount,
      );
      return bCount - aCount;
    });
  }, [data, showOpen]);

  const sharedYAxisMax = useMemo(() => {
    if (!data?.permittedOwnerMetrics) return undefined;
    return data.permittedOwnerMetrics.reduce((max, owner) => {
      const ownerMax = getMaxTrendValue(
        owner.lastMonthSeverityCount,
        showOpen,
        showTotal,
      );
      return Math.max(max, ownerMax);
    }, 0);
  }, [data, showOpen, showTotal]);

  if (error) {
    return <ErrorBanner errorTitle={errorTitle} errorMessage={error.message} />;
  }

  if (isLoading || !data) return <Progress />;

  if (isEmpty) {
    return (
      <Alert severity="info">
        Finner ingen komponenter som har sikkerhetsmetrikker
      </Alert>
    );
  }

  return (
    <Stack gap={4}>
      {sortedOwners.map(ownerMetrics => (
        <OwnerMetricsSection
          key={ownerMetrics.owner}
          ownerMetrics={ownerMetrics}
          showTotal={showTotal}
          showOpen={showOpen}
          yAxisMax={sharedYAxisMax}
        />
      ))}
      {data.notPermittedOwners?.length > 0 && (
        <Alert severity="warning">
          <Typography variant="body2">
            Du har ikke tilgang til metrikker for:{' '}
            {data.notPermittedOwners.join(', ')}
          </Typography>
        </Alert>
      )}
    </Stack>
  );
};

import { format } from 'date-fns';
import { useId, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from 'recharts';
import { BASIC_COLORS, SEVERITY_COLORS } from '../../colors';
import { yAxisAdjustment } from '../../utils/utils';
import { LinearGradient } from './LinearGradient';
import { TrendSeverityCounts } from '../../typesFrontend';
import { getAggregatedTrends } from './utils';
import { useTheme } from '@mui/material/styles';
import { TrendTooltip } from './TrendTooltip';
import type {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import type { TooltipContentProps } from 'recharts';

interface GraphProps {
  trendData: TrendSeverityCounts[];
  graphTimeline: string;
  showTotal: boolean;
  showOpen: boolean;
  yAxisMax?: number;
}

export const Graph = ({
  trendData,
  graphTimeline,
  showTotal,
  showOpen,
  yAxisMax,
}: GraphProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const uniqueId = useId();
  const criticalGradientId = `critical-${uniqueId}`;
  const highGradientId = `high-${uniqueId}`;

  const totalStroke = isDarkMode
    ? BASIC_COLORS.PRIMARY_LIGHT
    : BASIC_COLORS.PRIMARY_DARK;

  const data = useMemo(() => {
    const aggregatedTrends = getAggregatedTrends(trendData);

    return aggregatedTrends
      .filter(item => !showOpen || item.openTotal !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [trendData, showOpen]);

  const criticalDataKey = showOpen ? 'openCritical' : 'critical';
  const highDataKey = showOpen ? 'openHigh' : 'high';
  const totalDataKey = showOpen ? 'openTotal' : 'total';

  return (
    <ResponsiveContainer
      width="100%"
      height={220}
      style={{ paddingRight: '50px' }}
    >
      <AreaChart data={data}>
        <defs>
          <LinearGradient id={criticalGradientId} />
          <LinearGradient id={highGradientId} />
        </defs>

        <XAxis
          dataKey="date"
          tickFormatter={timestamp =>
            graphTimeline === 'oneYear'
              ? format(new Date(timestamp), 'dd-MM-yyyy')
              : format(new Date(timestamp), 'dd-MM')
          }
        />
        <YAxis
          type="number"
          domain={[0, yAxisMax ?? yAxisAdjustment(data, showOpen)]}
        />

        <Tooltip
          content={(props: TooltipContentProps<ValueType, NameType>) => (
            <TrendTooltip {...props} isDarkMode={isDarkMode} />
          )}
        />

        <Area
          type="monotone"
          dataKey={criticalDataKey}
          name={showOpen ? 'Åpne kritiske sårbarheter' : 'Kritiske sårbarheter'}
          stroke={SEVERITY_COLORS.CRITICAL}
          strokeWidth={2}
          fillOpacity={1}
          fill={`url(#${criticalGradientId})`}
        />

        <Area
          type="monotone"
          dataKey={highDataKey}
          name={showOpen ? 'Åpne høye sårbarheter' : 'Høye sårbarheter'}
          stroke={SEVERITY_COLORS.HIGH}
          strokeWidth={2}
          fillOpacity={1}
          fill={`url(#${highGradientId})`}
        />

        {showTotal && (
          <Area
            type="monotone"
            dataKey={totalDataKey}
            name={
              showOpen
                ? 'Totalt antall åpne sårbarheter'
                : 'Totalt antall sårbarheter'
            }
            stroke={totalStroke}
            strokeWidth={2}
            fillOpacity={0.05}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

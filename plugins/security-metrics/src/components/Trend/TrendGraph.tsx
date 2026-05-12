import { format } from 'date-fns';
import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from 'recharts';
import { BASIC_COLORS, SEVERITY_COLORS } from '../../colors';
import { yAxisAdjustment } from '../utils';
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
}

export const Graph = ({
  trendData,
  graphTimeline,
  showTotal,
  showOpen,
}: GraphProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const totalStroke = isDarkMode
    ? BASIC_COLORS.PRIMARY_LIGHT
    : BASIC_COLORS.PRIMARY_DARK;

  const data = useMemo(() => {
    const aggregatedTrends = getAggregatedTrends(trendData);

    return aggregatedTrends
      .filter(item => !showOpen || item.openTotal !== null)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
  }, [trendData, showOpen]);

  const criticalDataKey = showOpen ? 'openCritical' : 'critical';
  const highDataKey = showOpen ? 'openHigh' : 'high';
  const totalDataKey = showOpen ? 'openTotal' : 'total';

  return (
    <ResponsiveContainer
      width="100%"
      height={180}
      style={{ paddingRight: '50px' }}
    >
      <AreaChart data={data}>
        <defs>
          <LinearGradient id="critical" />
          <LinearGradient id="high" />
        </defs>

        <XAxis
          dataKey="timestamp"
          tickFormatter={timestamp =>
            graphTimeline === 'oneYear'
              ? format(new Date(timestamp), 'dd-MM-yyyy')
              : format(new Date(timestamp), 'dd-MM')
          }
        />
        <YAxis type="number" domain={[0, yAxisAdjustment(data, showOpen)]} />

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
          fill="url(#critical)"
        />

        <Area
          type="monotone"
          dataKey={highDataKey}
          name={showOpen ? 'Åpne høye sårbarheter' : 'Høye sårbarheter'}
          stroke={SEVERITY_COLORS.HIGH}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#high)"
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

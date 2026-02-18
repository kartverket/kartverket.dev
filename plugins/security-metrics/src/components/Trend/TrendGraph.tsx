import { format } from 'date-fns';
import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  TooltipProps,
} from 'recharts';
import { BASIC_COLORS, SEVERITY_COLORS } from '../../colors';
import { yAxisAdjustment } from '../utils';
import { LinearGradient } from './LinearGradient';
import { TrendSeverityCounts } from '../../typesFrontend';
import { getAggregatedTrends } from './utils';
import { useTheme } from '@mui/material/styles';
import { TrendTooltip } from './TrendTooltip';

interface GraphProps {
  trendData: TrendSeverityCounts[];
  graphTimeline: string;
  showTotal: boolean;
}

export const Graph = ({ trendData, graphTimeline, showTotal }: GraphProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const totalStroke = isDarkMode
    ? BASIC_COLORS.PRIMARY_LIGHT
    : BASIC_COLORS.PRIMARY_DARK;

  const data = useMemo(() => {
    const aggregatedTrends = getAggregatedTrends(trendData);
    return aggregatedTrends.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  }, [trendData]);

  return (
    <ResponsiveContainer
      width="100%"
      height={200}
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
        <YAxis type="number" domain={[0, yAxisAdjustment(data)]} />

        <Tooltip
          content={(props: TooltipProps<number, string>) => (
            <TrendTooltip {...props} isDarkMode={isDarkMode} />
          )}
        />

        <Area
          type="monotone"
          dataKey="critical"
          name="Kritiske sårbarheter"
          stroke={SEVERITY_COLORS.CRITICAL}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#critical)"
        />
        <Area
          type="monotone"
          dataKey="high"
          name="Høye sårbarheter"
          stroke={SEVERITY_COLORS.HIGH}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#high)"
        />

        {showTotal && (
          <Area
            type="monotone"
            dataKey="total"
            name="Totalt antall sårbarheter"
            stroke={totalStroke}
            strokeWidth={2}
            fillOpacity={0.05}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

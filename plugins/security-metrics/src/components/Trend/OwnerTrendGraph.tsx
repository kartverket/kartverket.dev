import { TrendSeverityCounts } from '../../typesFrontend';
import { CardTitle } from '../shared/CardTitle';
import { Graph } from './TrendGraph';
import Typography from '@mui/material/Typography';

interface OwnerTrendGraphProps {
  trendData: TrendSeverityCounts[];
  showTotal: boolean;
  showOpen: boolean;
  yAxisMax?: number;
}

export const OwnerTrendGraph = ({
  trendData,
  showTotal,
  showOpen,
  yAxisMax,
}: OwnerTrendGraphProps) => {
  return (
    <CardTitle
      title={showOpen ? 'Åpne sårbarheter over tid' : 'Sårbarheter over tid'}
      marginBottom
    >
      {trendData.length === 0 ? (
        <Typography sx={{ fontSize: '1rem', my: 2, ml: 2 }}>
          <i>Vi fant dessverre ingen historiske data.</i>
        </Typography>
      ) : (
        <Graph
          trendData={trendData}
          graphTimeline="oneMonth"
          showTotal={showTotal}
          showOpen={showOpen}
          yAxisMax={yAxisMax}
        />
      )}
    </CardTitle>
  );
};

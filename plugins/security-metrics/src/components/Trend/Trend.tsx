import { useRef, useState } from 'react';
import { getFromDate } from '../utils';
import { ErrorBanner } from '../ErrorBanner';
import { useTrendsQuery } from '../../hooks/useTrendsQuery';
import Typography from '@mui/material/Typography';
import { CardTitle } from '../CardTitle';
import { Graph } from './TrendGraph';
import { GraphLabels } from './GraphLabels';
import { Progress } from '@backstage/core-components';

interface TrendProps {
  componentNames: string[] | string;
}

export const Trend = ({ componentNames }: TrendProps) => {
  const toDate = useRef(new Date()).current;
  const [fromDate, setFromDate] = useState<Date>(() =>
    getFromDate('oneMonth', toDate),
  );
  const [graphTimeline, setGraphTimeline] = useState<string>('oneMonth');

  const items = Array.isArray(componentNames)
    ? componentNames
    : [componentNames];

  const { data, isPending, error } = useTrendsQuery(items, fromDate, toDate);

  return (
    <CardTitle title="Trend">
      {isPending && <Progress />}
      {data?.length === 0 && (
        <Typography sx={{ fontSize: '1rem', my: 2, ml: 2 }}>
          <i>Vi fant dessverre ingen historiske data.</i>
        </Typography>
      )}
      {data && (
        <>
          <Graph trendData={data} graphTimeline={graphTimeline} />
          <GraphLabels
            graphTimeline={graphTimeline}
            setGraphTimeline={setGraphTimeline}
            setFromDate={setFromDate}
          />
        </>
      )}
      {error && <ErrorBanner errorMessage={error?.message} />}
    </CardTitle>
  );
};

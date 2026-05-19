import Chip from '@mui/material/Chip';
import { useMemo } from 'react';
import { Box } from '@mui/system';
import { getFromDate } from '../utils';
import { GraphTimeline } from '../../typesFrontend';

type GraphLabelProps = {
  label: string;
  value: GraphTimeline;
  selectedValue: GraphTimeline;
  setSelectedValue: (value: GraphTimeline) => void;
  textColor?: string;
  color?: string;
};

const GraphLabel = ({
  label,
  value,
  selectedValue,
  setSelectedValue,
  textColor,
  color,
}: GraphLabelProps) => (
  <Chip
    label={label}
    onClick={() => setSelectedValue(value)}
    variant={selectedValue === value ? 'filled' : 'outlined'}
    sx={{
      backgroundColor: selectedValue === value ? color : undefined,
      color: textColor,
      fontWeight: selectedValue === value ? 600 : 400,
      cursor: 'pointer',
    }}
  />
);

type GraphLabelsProps = {
  graphTimeline: GraphTimeline;
  setGraphTimeline: (value: GraphTimeline) => void;
  setFromDate: (value: Date) => void;
};

const timelineOptions: { label: string; value: GraphTimeline }[] = [
  { label: '1 år', value: 'oneYear' },
  { label: '6 mnd', value: 'sixMonths' },
  { label: '3 mnd', value: 'threeMonths' },
  { label: '1 mnd', value: 'oneMonth' },
  { label: '14 dager', value: 'fourteenDays' },
];

export const GraphLabels = ({
  graphTimeline,
  setGraphTimeline,
  setFromDate,
}: GraphLabelsProps) => {
  const todayDate = useMemo(() => new Date(), []);

  const handleTimelineChange = (value: GraphTimeline) => {
    setGraphTimeline(value);
    setFromDate(getFromDate(value, todayDate));
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      gap={1}
      paddingBottom={2}
      flexWrap="wrap"
    >
      {timelineOptions.map(option => (
        <GraphLabel
          key={option.value}
          label={option.label}
          value={option.value}
          selectedValue={graphTimeline}
          setSelectedValue={handleTimelineChange}
        />
      ))}
    </Box>
  );
};

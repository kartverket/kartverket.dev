import Chip from '@mui/material/Chip';
import { useMemo } from 'react';
import { BASIC_COLORS } from '../../colors';
import { Box } from '@mui/system';
import { getFromDate } from '../utils';

type GraphLabelProps = {
  label: string;
  value: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
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
}: GraphLabelProps) => {
  return (
    <Chip
      label={label}
      onClick={() => setSelectedValue(value)}
      sx={{
        backgroundColor: color,
        color: textColor,
        outline: selectedValue === value ? 1 : 0,
        outlineColor: BASIC_COLORS.BLACK,
      }}
    />
  );
};

type GraphLabelsProps = {
  graphTimeline: string;
  setGraphTimeline: (value: string) => void;
  setFromDate: (value: Date) => void;
};

export const GraphLabels = ({
  graphTimeline,
  setGraphTimeline,
  setFromDate,
}: GraphLabelsProps) => {
  const todayDate = useMemo(() => new Date(), []);
  const handleTimelineChange = (value: string) => {
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
    >
      <GraphLabel
        label="1 uke"
        value="oneWeek"
        selectedValue={graphTimeline}
        setSelectedValue={handleTimelineChange}
      />
      <GraphLabel
        label="1 mnd"
        value="oneMonth"
        selectedValue={graphTimeline}
        setSelectedValue={handleTimelineChange}
      />
      <GraphLabel
        label="1 år"
        value="oneYear"
        selectedValue={graphTimeline}
        setSelectedValue={handleTimelineChange}
      />
    </Box>
  );
};

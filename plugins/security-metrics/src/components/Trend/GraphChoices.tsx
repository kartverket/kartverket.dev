import Chip from '@mui/material/Chip';
import { Box } from '@mui/system';
import { GraphData } from '../../typesFrontend';

type GraphChoiceProps = {
  label: string;
  value: GraphData;
  selectedValue: GraphData;
  setSelectedValue: (value: GraphData) => void;
  textColor?: string;
  color?: string;
};

const GraphChoice = ({
  label,
  value,
  selectedValue,
  setSelectedValue,
  textColor,
  color,
}: GraphChoiceProps) => (
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

type GraphChoicesProps = {
  graphData: GraphData;
  setGraphData: (value: GraphData) => void;
};

const graphDataOptions: { label: string; value: GraphData }[] = [
  { label: 'Åpne', value: 'open' },
  { label: 'Løste', value: 'solved' },
];

export const GraphChoices = ({
  graphData,
  setGraphData,
}: GraphChoicesProps) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      gap={1}
      paddingBottom={2}
      flexWrap="wrap"
    >
      {graphDataOptions.map(option => (
        <GraphChoice
          key={option.value}
          label={option.label}
          value={option.value}
          selectedValue={graphData}
          setSelectedValue={setGraphData}
        />
      ))}
    </Box>
  );
};

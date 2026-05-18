import { Box } from '@mui/system';

interface Props {
  children: React.ReactNode;
}

export const MetricsGrid = ({ children }: Props) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: '1fr',
        md: '1fr 1fr',
        lg: '1fr 1fr 2fr 2fr',
        xl: '2fr 2fr 4fr 5fr',
      }}
      gap={2}
      gridAutoRows="minmax(280px, auto)"
    >
      {children}
    </Box>
  );
};

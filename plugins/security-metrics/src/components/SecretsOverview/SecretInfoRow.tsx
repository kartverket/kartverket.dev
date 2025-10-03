import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';

type Props = {
  description: string;
  value: string;
};

export const SecretInfoRow = ({ description, value }: Props) => {
  return (
    <Box display="flex" flexDirection="row">
      <Typography flex={2} fontWeight="bold">
        {description}
      </Typography>
      <Typography flex={3}>{value}</Typography>
    </Box>
  );
};

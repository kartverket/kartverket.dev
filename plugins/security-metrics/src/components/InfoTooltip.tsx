import { InfoOutlined } from '@mui/icons-material';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

type Props = {
  size?: 'inherit' | 'large' | 'medium' | 'small';
} & Omit<TooltipProps, 'children'>;

export const InfoTooltip = ({ size = 'small', ...rest }: Props) => {
  return (
    <Tooltip arrow sx={{ cursor: 'pointer' }} placement="right" {...rest}>
      <InfoOutlined fontSize={size} />
    </Tooltip>
  );
};

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import type { SxProps, Theme } from '@mui/material/styles';
import { BASIC_COLORS } from '../../colors';

export type TagStyle = {
  text: string;
  bg: string;
  border: string;
};

type Props = {
  selectedStyle: TagStyle;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  tooltip?: string;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
};

export const Tag = ({
  selectedStyle,
  selected = true,
  disabled = false,
  onClick,
  tooltip,
  sx,
  children,
}: Props) => {
  const clickable = !!onClick && !disabled;
  const color = selected ? selectedStyle.text : BASIC_COLORS.GREY;

  const interactiveProps = clickable
    ? { component: 'button' as const, type: 'button' as const, onClick }
    : {};

  return (
    <Tooltip
      title={tooltip ?? ''}
      disableHoverListener={!tooltip}
      disableFocusListener={!tooltip}
      disableTouchListener={!tooltip}
    >
      <Box
        {...interactiveProps}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          borderRadius: 1,
          border: '1px solid',
          borderColor: selected ? selectedStyle.border : color,
          bgcolor: selected ? selectedStyle.bg : 'transparent',
          color,
          cursor: clickable ? 'pointer' : 'default',
          opacity: disabled ? 0.3 : 1,
          fontFamily: 'inherit',
          ...sx,
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
};

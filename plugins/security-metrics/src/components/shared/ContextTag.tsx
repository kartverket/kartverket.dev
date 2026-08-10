import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { BASIC_COLORS, CONTEXT_CHIP_COLORS } from '../../colors';
import type { ContextSignal } from '../../typesFrontend';

const variantStyles: Record<
  ContextSignal,
  { bg: string; color: string; border?: string }
> = {
  kev: { bg: CONTEXT_CHIP_COLORS.KEV_BG, color: CONTEXT_CHIP_COLORS.KEV_TEXT },
  exploit: {
    bg: CONTEXT_CHIP_COLORS.EXPLOIT_RUNNING_BG,
    color: CONTEXT_CHIP_COLORS.EXPLOIT_RUNNING_TEXT,
  },
  running: {
    bg: CONTEXT_CHIP_COLORS.EXPLOIT_RUNNING_BG,
    color: CONTEXT_CHIP_COLORS.EXPLOIT_RUNNING_TEXT,
  },
  notRunning: {
    bg: CONTEXT_CHIP_COLORS.NEUTRAL_BG,
    color: CONTEXT_CHIP_COLORS.NEUTRAL_TEXT,
  },
  fix: { bg: CONTEXT_CHIP_COLORS.FIX_BG, color: CONTEXT_CHIP_COLORS.FIX_TEXT },
  noFix: {
    bg: CONTEXT_CHIP_COLORS.NO_FIX_BG,
    color: CONTEXT_CHIP_COLORS.NO_FIX_TEXT,
  },
  direct: {
    bg: CONTEXT_CHIP_COLORS.DIRECT_BG,
    color: CONTEXT_CHIP_COLORS.DIRECT_TEXT,
  },
  transitive: {
    bg: 'transparent',
    color: BASIC_COLORS.GREY,
    border: `1px solid ${BASIC_COLORS.GREY}`,
  },
};

type Props = {
  variant: ContextSignal;
  label?: string;
  tooltip?: string;
  Icon: React.ComponentType<SvgIconProps>;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
};

export const ContextTag = ({
  variant,
  label,
  tooltip,
  Icon,
  onClick,
  selected = true,
  disabled = false,
}: Props) => {
  const styles = variantStyles[variant];
  const clickable = !!onClick && !disabled;
  const color = selected ? styles.color : BASIC_COLORS.GREY;

  const interactiveProps = clickable
    ? { component: 'button' as const, type: 'button' as const, onClick }
    : {};

  return (
    <Tooltip title={tooltip}>
      <Box
        {...interactiveProps}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          p: 0.5,
          borderRadius: 1,
          bgcolor: selected ? styles.bg : 'transparent',
          border: selected
            ? (styles.border ?? '1px solid transparent')
            : '1px solid',
          borderColor: color,
          whiteSpace: 'nowrap',
          cursor: clickable ? 'pointer' : 'default',
          opacity: disabled ? 0.3 : 1,
          color,
        }}
      >
        <Icon sx={{ fontSize: '1rem', color }} />
        {label && (
          <Typography
            variant="caption"
            sx={{
              color,
              fontWeight: 500,
              fontSize: '0.8rem',
              lineHeight: 1,
            }}
          >
            {label}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

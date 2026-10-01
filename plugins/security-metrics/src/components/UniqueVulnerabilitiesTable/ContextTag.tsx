import Typography from '@mui/material/Typography';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { useTheme } from '@mui/material/styles';
import { BASIC_COLORS, CONTEXT_TAG_COLORS } from '../../colors';
import type { ContextSignal } from '../../typesFrontend';
import { Tag, type TagStyle } from '../shared/Tag';

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
  const theme = useTheme();
  const colors =
    theme.palette.mode === 'dark'
      ? CONTEXT_TAG_COLORS.DARK
      : CONTEXT_TAG_COLORS.LIGHT;
  const variantStyles: Record<ContextSignal, TagStyle> = {
    kev: { 
      text: colors.KEV_TEXT, 
      bg: colors.KEV_BG, 
      border: colors.KEV_TEXT 
    },
    exploit: {
      text: colors.EXPLOIT_RUNNING_TEXT,
      bg: colors.EXPLOIT_RUNNING_BG,
      border: colors.EXPLOIT_RUNNING_TEXT,
    },
    running: {
      text: colors.EXPLOIT_RUNNING_TEXT,
      bg: colors.EXPLOIT_RUNNING_BG,
      border: colors.EXPLOIT_RUNNING_TEXT,
    },
    notRunning: {
      text: BASIC_COLORS.TAG_NEUTRAL_TEXT,
      bg: BASIC_COLORS.TAG_NEUTRAL_BG,
      border: BASIC_COLORS.TAG_NEUTRAL_TEXT,
    },
    fix: { 
      text: colors.FIX_TEXT, 
      bg: colors.FIX_BG, 
      border: colors.FIX_TEXT 
    },
    noFix: {
      text: colors.NO_FIX_TEXT,
      bg: colors.NO_FIX_BG,
      border: colors.NO_FIX_TEXT,
    },
    direct: {
      text: colors.DIRECT_TEXT,
      bg: colors.DIRECT_BG,
      border: colors.DIRECT_TEXT,
    },
    transitive: {
      text: BASIC_COLORS.GREY,
      bg: 'transparent',
      border: BASIC_COLORS.GREY,
    },
  };

  return (
    <Tag
      selectedStyle={variantStyles[variant]}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
      tooltip={tooltip}
      sx={{
        gap: 0.5,
        p: 0.5,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon sx={{ fontSize: '1rem' }} />
      {label && (
        <Typography
          variant="caption"
          sx={{
            color: 'inherit',
            fontWeight: 500,
            fontSize: '0.8rem',
            lineHeight: 1,
          }}
        >
          {label}
        </Typography>
      )}
    </Tag>
  );
};

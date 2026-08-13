import Typography from '@mui/material/Typography';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { BASIC_COLORS, CONTEXT_TAG_COLORS } from '../../colors';
import type { ContextSignal } from '../../typesFrontend';
import { Tag, type TagStyle } from '../shared/Tag';

const variantStyles: Record<ContextSignal, TagStyle> = {
  kev: {
    text: CONTEXT_TAG_COLORS.KEV_TEXT,
    bg: CONTEXT_TAG_COLORS.KEV_BG,
    border: CONTEXT_TAG_COLORS.KEV_TEXT,
  },
  exploit: {
    text: CONTEXT_TAG_COLORS.EXPLOIT_RUNNING_TEXT,
    bg: CONTEXT_TAG_COLORS.EXPLOIT_RUNNING_BG,
    border: CONTEXT_TAG_COLORS.EXPLOIT_RUNNING_TEXT,
  },
  running: {
    text: CONTEXT_TAG_COLORS.EXPLOIT_RUNNING_TEXT,
    bg: CONTEXT_TAG_COLORS.EXPLOIT_RUNNING_BG,
    border: CONTEXT_TAG_COLORS.EXPLOIT_RUNNING_TEXT,
  },
  notRunning: {
    text: BASIC_COLORS.TAG_NEUTRAL_TEXT,
    bg: BASIC_COLORS.TAG_NEUTRAL_BG,
    border: BASIC_COLORS.TAG_NEUTRAL_TEXT,
  },
  fix: {
    text: CONTEXT_TAG_COLORS.FIX_TEXT,
    bg: CONTEXT_TAG_COLORS.FIX_BG,
    border: CONTEXT_TAG_COLORS.FIX_TEXT,
  },
  noFix: {
    text: CONTEXT_TAG_COLORS.NO_FIX_TEXT,
    bg: CONTEXT_TAG_COLORS.NO_FIX_BG,
    border: CONTEXT_TAG_COLORS.NO_FIX_TEXT,
  },
  direct: {
    text: CONTEXT_TAG_COLORS.DIRECT_TEXT,
    bg: CONTEXT_TAG_COLORS.DIRECT_BG,
    border: CONTEXT_TAG_COLORS.DIRECT_TEXT,
  },
  transitive: {
    text: BASIC_COLORS.GREY,
    bg: 'transparent',
    border: BASIC_COLORS.GREY,
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
}: Props) => (
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

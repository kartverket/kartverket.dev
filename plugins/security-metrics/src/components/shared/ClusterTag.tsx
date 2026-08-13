import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { formatClusterLabel } from '../UniqueVulnerabilitiesTable/utils';
import { BASIC_COLORS, CLUSTER_TAG_COLORS } from '../../colors';

type Props = {
  cluster: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  tooltip?: string;
};

const CLUSTER_STYLES: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  prod: {
    text: CLUSTER_TAG_COLORS.PROD_TEXT,
    bg: CLUSTER_TAG_COLORS.PROD_BG,
    border: CLUSTER_TAG_COLORS.PROD_BORDER,
  },
  dev: {
    text: CLUSTER_TAG_COLORS.DEV_TEXT,
    bg: CLUSTER_TAG_COLORS.DEV_BG,
    border: CLUSTER_TAG_COLORS.DEV_BORDER,
  },
};

const DEFAULT_STYLE = {
  text: BASIC_COLORS.TAG_NEUTRAL_TEXT,
  bg: BASIC_COLORS.TAG_NEUTRAL_BG,
  border: BASIC_COLORS.LIGHT_GREY,
};

export const ClusterTag = ({
  cluster,
  onClick,
  selected = true,
  disabled = false,
  tooltip,
}: Props) => {
  const label = formatClusterLabel(cluster);
  const clickable = !!onClick && !disabled;
  const resolvedTooltip = tooltip ?? (cluster !== label ? cluster : '');
  const style = CLUSTER_STYLES[label] ?? DEFAULT_STYLE;
  const color = selected ? style.text : BASIC_COLORS.GREY;

  const interactiveProps = clickable
    ? { component: 'button' as const, type: 'button' as const, onClick }
    : {};

  return (
    <Tooltip
      title={resolvedTooltip}
      disableHoverListener={!resolvedTooltip}
      disableFocusListener={!resolvedTooltip}
      disableTouchListener={!resolvedTooltip}
    >
      <Box
        {...interactiveProps}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          px: 0.75,
          py: 0.5,
          borderRadius: 1,
          border: '1px solid',
          borderColor: selected ? style.border : color,
          bgcolor: selected ? style.bg : 'transparent',
          color,
          fontSize: '0.7rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          cursor: clickable ? 'pointer' : 'default',
          opacity: disabled ? 0.3 : 1,
          fontFamily: 'inherit',
        }}
      >
        {label}
      </Box>
    </Tooltip>
  );
};

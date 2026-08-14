import Box from '@mui/material/Box';
import { formatClusterLabel } from './utils';
import { BASIC_COLORS, CLUSTER_TAG_COLORS } from '../../colors';
import { Tag, type TagStyle } from '../shared/Tag';

type Props = {
  cluster: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  tooltip?: string;
};

const CLUSTER_STYLES: Record<string, TagStyle> = {
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

const DEFAULT_STYLE: TagStyle = {
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
  const resolvedTooltip = tooltip ?? (cluster !== label ? cluster : undefined);
  const selectedStyle = CLUSTER_STYLES[label] ?? DEFAULT_STYLE;

  return (
    <Tag
      selectedStyle={selectedStyle}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
      tooltip={resolvedTooltip}
      sx={{
        px: 0.75,
        py: 0.5,
        fontSize: '0.7rem',
        fontWeight: 500,
        textTransform: 'uppercase',
      }}
    >
      <Box component="span">{label}</Box>
    </Tag>
  );
};

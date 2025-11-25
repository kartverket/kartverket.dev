import { Star, StarBorder } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export type FilterEnum = 'all' | 'starred';

type Props = {
  hasStarred: boolean;
  effectiveFilter: FilterEnum;
  onToggle: () => void;
};

export const StarFilterButton = ({
  hasStarred,
  effectiveFilter,
  onToggle,
}: Props) => {
  if (!hasStarred) return null;

  const isStarred = effectiveFilter === 'starred';

  return (
    <Tooltip
      title={
        isStarred ? 'Vis alle komponenter' : 'Vis stjernemerkede komponenter'
      }
    >
      <IconButton
        disableRipple
        disableFocusRipple
        onClick={onToggle}
        sx={{
          p: 0.5,
          '&:hover': { backgroundColor: 'transparent' },
        }}
      >
        {isStarred ? <Star sx={{ color: '#fbc02d' }} /> : <StarBorder />}
      </IconButton>
    </Tooltip>
  );
};

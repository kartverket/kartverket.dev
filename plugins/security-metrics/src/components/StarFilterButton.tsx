import { Star, StarBorder } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { FilterEnum } from '../typesFrontend';
import { STAR_COLOR } from '../colors';

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
      <IconButton onClick={onToggle} sx={{ p: 0.5 }}>
        {isStarred ? <Star sx={{ color: STAR_COLOR }} /> : <StarBorder />}
      </IconButton>
    </Tooltip>
  );
};

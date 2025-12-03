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
  const isStarred = effectiveFilter === 'starred';

  let title = 'Du har ingen stjernemarkerte komponenter';
  if (hasStarred && isStarred) {
    title = 'Vis alle komponenter';
  } else if (hasStarred && !isStarred) {
    title = 'Vis stjernemarkerte komponenter';
  }

  return (
    <Tooltip title={title}>
      <span>
        <IconButton disabled={!hasStarred} onClick={onToggle} sx={{ p: 0.5 }}>
          {isStarred ? <Star sx={{ color: STAR_COLOR }} /> : <StarBorder />}
        </IconButton>
      </span>
    </Tooltip>
  );
};

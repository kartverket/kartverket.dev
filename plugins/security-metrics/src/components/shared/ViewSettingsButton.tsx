import Button from '@mui/material/Button';
import TuneIcon from '@mui/icons-material/Tune';
import { useState } from 'react';
import { ViewSettingsDialog } from './ViewSettingsDialog';
import { FilterEnum } from '../../typesFrontend';

interface StarFilterProps {
  hasStarred: boolean;
  effectiveFilter: FilterEnum;
  onToggleStarFilter: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
}

interface Props {
  showTotal: boolean;
  onToggleShowTotal: () => void;
  starFilter?: StarFilterProps;
}

export const ViewSettingsButton = ({
  showTotal,
  onToggleShowTotal,
  starFilter,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="text"
        startIcon={<TuneIcon />}
        color="primary"
        onClick={() => setOpen(true)}
      >
        Tilpass visning
      </Button>
      <ViewSettingsDialog
        open={open}
        onClose={() => setOpen(false)}
        showTotal={showTotal}
        onToggleShowTotal={onToggleShowTotal}
        starFilter={starFilter}
      />
    </>
  );
};

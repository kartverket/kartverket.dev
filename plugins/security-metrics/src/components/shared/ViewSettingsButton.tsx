import TuneIcon from '@mui/icons-material/Tune';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { FilterEnum } from '../../typesFrontend';
import { ViewSettingsDialog } from './ViewSettingsDialog';

export type StarFilterProps = {
  hasStarred: boolean;
  effectiveFilter: FilterEnum;
  onToggleStarFilter: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
};

type Props = {
  showTotal: boolean;
  showOpen: boolean;
  onToggleShowTotal: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
  onToggleShowOpen: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
  starFilter?: StarFilterProps;
};

export const ViewSettingsButton = ({
  showTotal,
  showOpen,
  onToggleShowTotal,
  onToggleShowOpen,
  starFilter,
}: Props) => {
  const [openViewSettings, setOpenViewSettings] = useState(false);

  return (
    <>
      <Button
        variant="text"
        startIcon={<TuneIcon />}
        color="primary"
        onClick={() => setOpenViewSettings(true)}
      >
        Tilpass visning
      </Button>
      <ViewSettingsDialog
        open={openViewSettings}
        onClose={() => setOpenViewSettings(false)}
        starFilter={starFilter}
        showTotal={showTotal}
        showOpen={showOpen}
        onToggleShowTotal={onToggleShowTotal}
        onToggleShowOpen={onToggleShowOpen}
      />
    </>
  );
};

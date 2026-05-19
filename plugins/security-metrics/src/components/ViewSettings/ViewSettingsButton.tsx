import TuneIcon from '@mui/icons-material/Tune';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { useState } from 'react';
import { FilterEnum } from '../../typesFrontend';
import { ViewSettingsDialog } from './ViewSettingsDialog';

export interface StarFilterProps {
  hasStarred: boolean;
  effectiveFilter: FilterEnum;
  onToggleStarFilter: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
}

interface Props {
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
}

export const ViewSettingsButton = ({
  showTotal,
  showOpen,
  onToggleShowTotal,
  onToggleShowOpen,
  starFilter,
}: Props) => {
  const [openViewSettings, setOpenViewSettings] = useState(false);

  return (
    <Box display="flex" alignItems="center" ml="auto" gap={0.5}>
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
    </Box>
  );
};

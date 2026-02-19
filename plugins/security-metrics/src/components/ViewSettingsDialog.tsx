import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { FilterEnum } from '../typesFrontend';

interface StarFilterProps {
  hasStarred: boolean;
  effectiveFilter: FilterEnum;
  onToggleStarFilter: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
  starFilter?: StarFilterProps;
  showTotal: boolean;
  onToggleShowTotal: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
}

export const ViewSettingsDialog = ({
  open,
  onClose,
  starFilter,
  showTotal,
  onToggleShowTotal,
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Tilpass visning</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pt: '12px !important',
        }}
      >
        {starFilter && (
          <>
            <Typography variant="subtitle2" color="text.secondary">
              Komponenter
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={starFilter.effectiveFilter === 'starred'}
                  onChange={starFilter.onToggleStarFilter}
                  disabled={!starFilter.hasStarred}
                />
              }
              label="Vis kun stjernemarkerte komponenter"
            />
            <Divider />
          </>
        )}

        <Typography variant="subtitle2" color="text.secondary">
          Trend
        </Typography>
        <FormControlLabel
          control={<Switch checked={showTotal} onChange={onToggleShowTotal} />}
          label="Vis totalt antall sårbarheter"
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', pb: 2, pr: 2 }}>
        <Button onClick={onClose}>Lukk</Button>
      </DialogActions>
    </Dialog>
  );
};

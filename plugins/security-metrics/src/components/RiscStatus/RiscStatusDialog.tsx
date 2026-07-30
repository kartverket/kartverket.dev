import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { RiscStatusData } from '../../typesFrontend';
import { RiscStatusTable } from './RiscStatusTable';

type Props = {
  categoryLabel: string;
  riscStatuses: RiscStatusData[];
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
};

export const RiscStatusDialog = ({
  categoryLabel,
  riscStatuses,
  isDialogOpen,
  setIsDialogOpen,
}: Props) => (
  <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth>
    <DialogContent>
      <Typography variant="h6" mb={3}>
        {categoryLabel}
      </Typography>
      {categoryLabel === 'Utdatert RoS' && (
        <Typography variant="body2" mb={2}>
          RoSer som er mer enn ett år gamle regnes som utdaterte.
        </Typography>
      )}
      {riscStatuses.length === 0 ? (
        <Typography variant="body2" fontStyle="italic">
          Ingen komponenter {categoryLabel === 'Mangler RoS' ? '' : 'har'}{' '}
          {categoryLabel.toLowerCase()}
        </Typography>
      ) : (
        <RiscStatusTable statuses={riscStatuses} />
      )}
    </DialogContent>
  </Dialog>
);

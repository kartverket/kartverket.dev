import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RiscStatusData } from '../../typesFrontend';
import { TeamRiscSection } from './TeamRiscSection';

export type OwnerRiscGroup = {
  owner: string;
  statuses: RiscStatusData[];
};

type Props = {
  categoryLabel: string;
  groups: OwnerRiscGroup[];
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
};

export const RiscStatusByTeamDialog = ({
  categoryLabel,
  groups,
  isDialogOpen,
  setIsDialogOpen,
}: Props) => {
  const totalCount = groups.reduce((sum, g) => sum + g.statuses.length, 0);

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      fullWidth
    >
      <DialogContent>
        <Typography variant="h6" mb={3}>
          {categoryLabel}
        </Typography>
        {categoryLabel === 'Utdatert RoS' && (
          <Typography variant="body2" mb={2}>
            RoSer som er mer enn ett år gamle regnes som utdaterte.
          </Typography>
        )}
        {totalCount === 0 ? (
          <Typography variant="body2" fontStyle="italic">
            Ingen komponenter {categoryLabel === 'Mangler RoS' ? '' : 'har'}{' '}
            {categoryLabel.toLowerCase()}
          </Typography>
        ) : (
          <Stack gap={3}>
            {groups.map(g => (
              <TeamRiscSection
                key={g.owner}
                owner={g.owner}
                statuses={g.statuses}
              />
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

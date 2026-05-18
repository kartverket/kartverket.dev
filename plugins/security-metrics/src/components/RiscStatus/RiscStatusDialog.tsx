import { HighlightOffOutlined } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { RepositorySummary } from '../../typesFrontend';
import { StyledTableRow } from '../shared/StyledTableRow';
import { riscStatusLabel } from './RiscStatusLabel';

type Props = {
  categoryLabel: string;
  repos: RepositorySummary[];
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
};

export const RiscStatusDialog = ({
  categoryLabel,
  repos,
  isDialogOpen,
  setIsDialogOpen,
}: Props) => (
  <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth>
    <DialogContent>
      <Typography variant="h6" mb={3}>
        {categoryLabel}
      </Typography>
      <Table>
        <TableBody>
          {repos.map(repo => (
            <StyledTableRow key={repo.repoName}>
              <TableCell>
                <Typography variant="body2">{repo.repoName}</Typography>
              </TableCell>
              <TableCell align="right">
                {repo.riscStatus?.hasRisc ? (
                  riscStatusLabel(repo.riscStatus)
                ) : (
                  <Tooltip title="Mangler operasjonell RoS">
                    <HighlightOffOutlined color="error" />
                  </Tooltip>
                )}
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </DialogContent>
  </Dialog>
);

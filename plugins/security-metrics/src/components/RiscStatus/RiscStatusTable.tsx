import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { RiscStatusData } from '../../typesFrontend';
import { StyledTableRow } from '../shared/StyledTableRow';
import { riscStatusLabel } from './RiscStatusLabel';

type Props = {
  statuses: RiscStatusData[];
};

export const RiscStatusTable = ({ statuses }: Props) => (
  <Table>
    <TableBody>
      {statuses.map(status => (
        <StyledTableRow key={status.repositoryName ?? 'unknown'}>
          <TableCell>
            <Typography variant="body2">
              {status.repositoryName ?? 'Ukjent'}
            </Typography>
          </TableCell>
          <TableCell align="right">
            {status.hasRisc ? (
              riscStatusLabel(status)
            ) : (
              <Tooltip title="Mangler operasjonell RoS">
                <CloseIcon color="error" />
              </Tooltip>
            )}
          </TableCell>
        </StyledTableRow>
      ))}
    </TableBody>
  </Table>
);

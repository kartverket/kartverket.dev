import { CheckCircleOutlined, HighlightOffOutlined } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  AggregatedScannerStatus,
  RepositoryScannerStatusData,
} from '../../typesFrontend';
import { StyledTableRow } from '../shared/StyledTableRow';

type Props = {
  scannerStatus: AggregatedScannerStatus;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
};

export const ScannerStatusDialog = ({
  scannerStatus,
  isDialogOpen,
  setIsDialogOpen,
}: Props) => {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      fullWidth
    >
      <DialogContent>
        <Typography variant="h6" mb={3}>
          Skrudd på {scannerStatus.scannerName}
        </Typography>
        <Table>
          <TableBody>
            {scannerStatus.repositoryStatus
              .slice()
              .sort((a, b) => {
                const aConfigured = a.scannerStatus.find(
                  scanner => scanner.type === scannerStatus.scannerName,
                )?.on;
                const bConfigured = b.scannerStatus.find(
                  scanner => scanner.type === scannerStatus.scannerName,
                )?.on;
                return (aConfigured ? 1 : 0) - (bConfigured ? 1 : 0);
              })
              .map((status: RepositoryScannerStatusData) => (
                <StyledTableRow key={status.componentNames.join(',')}>
                  <TableCell>
                    {status.componentNames.map(name => (
                      <Typography key={name} variant="body2">
                        {name}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    {status.scannerStatus.find(
                      scanner => scanner.type === scannerStatus.scannerName,
                    )?.on ? (
                      <Tooltip title="Konfigurert">
                        <CheckCircleOutlined color="success" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Ikke konfigurert">
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
};

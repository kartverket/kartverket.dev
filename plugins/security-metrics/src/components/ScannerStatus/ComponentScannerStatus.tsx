import { CheckCircleOutlined, HighlightOffOutlined } from '@mui/icons-material';
import Typography from '@mui/material/Typography';

import type { RepositoryScannerStatusData } from '../../typesFrontend';
import { CardTitle } from '../CardTitle';
import { StyledTableRow } from '../TableRow';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';

type ComponentScannerStatusProps = {
  scannerStatus: RepositoryScannerStatusData;
};

export const ComponentScannerStatus = ({
  scannerStatus,
}: ComponentScannerStatusProps) => {
  if (!scannerStatus) {
    return (
      <CardTitle title="Skannere">
        <Stack px={2}>
          <Typography data-testid="noData">
            <i>Vi fant dessverre ingen status på skannere.</i>
          </Typography>
        </Stack>
      </CardTitle>
    );
  }

  return (
    <CardTitle title="Skannere">
      <Stack px={2}>
        <Table size="small">
          <TableBody>
            {scannerStatus.scannerStatus.map(status => (
              <StyledTableRow key={status.type}>
                <TableCell>
                  <Typography>{status.type}</Typography>
                </TableCell>
                <TableCell>
                  {status.on ? (
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
      </Stack>
    </CardTitle>
  );
};

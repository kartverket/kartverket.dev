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
import InfoIcon from '@mui/icons-material/Info';

type ComponentScannerStatusProps = {
  scannerStatus: RepositoryScannerStatusData;
};

const scannerTooltips: Record<string, string> = {
  Dependabot:
    'Scanner kodeavhengigheter for kjente sårbarheter. Bør være aktivert på alle repoer som ikke er av typen documentation.',
  CodeQL: 'Analyserer selve kildekoden for konfigurasjonsfeil.',
  Pharos:
    'Scanner docker images og infrastruktur for sårbarheter. Krever at repoet bygger container.',
  Sysdig: 'Scanner tjenester som kjører på SKIP for sårbarheter. Ikke relevant dersom man ikke kan/skal kjøre på SKIP',
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
                <TableCell sx={{ pl: 0.5 }}>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Tooltip title={scannerTooltips[status.type]}>
                      <InfoIcon
                        fontSize="small"
                        sx={{ color: 'text.secondary' }}
                      />
                    </Tooltip>
                    <Typography>{status.type}</Typography>
                  </Stack>
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

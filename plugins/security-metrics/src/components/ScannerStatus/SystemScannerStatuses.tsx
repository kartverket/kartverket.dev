import {
  getAggregatedScannerStatus,
  getScannerStatusData,
} from '../../mapping/getScannerData';
import {
  AggregatedScannerStatus,
  RepositorySummary,
} from '../../typesFrontend';
import { CardTitle } from '../CardTitle';
import { StyledTableRow } from '../TableRow';
import { ScannerStatusDialog } from './SystemStatusDialog';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import InfoIcon from '@mui/icons-material/Info';

interface SystemScannerStatusProps {
  data: RepositorySummary[];
}

const scannerTooltips: Record<string, string> = {
  Dependabot:
    'Scanner kodeavhengigheter for kjente sårbarheter. Bør være aktivert på alle repoer som ikke er av typen documentation.',
  CodeQL: 'Analyserer selve kildekoden for sikkerhetsfeil.',
  Pharos:
    'Scanner docker images og infrastruktur for sårbarheter. Krever at repoet bygger container.',
  Sysdig: 'Scanner tjenester som kjører på SKIP for sårbarheter.',
};

export const SystemScannerStatuses = ({ data }: SystemScannerStatusProps) => {
  const repositoryScannerStatus = getScannerStatusData(data);

  const aggregatedStatus = getAggregatedScannerStatus(repositoryScannerStatus);

  if (!aggregatedStatus || aggregatedStatus.length === 0) {
    return (
      <CardTitle title="Skannere">
        <Box px={2}>
          <Typography data-testid="noData">
            <i>Vi fant dessverre ingen status på skannere.</i>
          </Typography>
        </Box>
      </CardTitle>
    );
  }

  return (
    <CardTitle title="Skannere">
      <Box px={2}>
        <Table size="small">
          <TableBody>
            {aggregatedStatus.map((status: AggregatedScannerStatus) => (
              <StyledTableRow key={status.scannerName}>
                <TableCell sx={{ pl: 0.5 }}>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Tooltip title={scannerTooltips[status.scannerName]}>
                      <InfoIcon
                        fontSize="small"
                        sx={{ color: 'text.secondary' }}
                      />
                    </Tooltip>
                    <Typography>{status.scannerName}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <ScannerStatusDialog scannerStatus={status} />
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </CardTitle>
  );
};

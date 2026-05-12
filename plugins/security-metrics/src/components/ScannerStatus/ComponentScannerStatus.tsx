import { CheckCircleOutlined } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import type { RepositoryScannerStatusData } from '../../typesFrontend';
import { CardTitle } from '../CardTitle';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import { ScannerInfo } from './ScannerInfo';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

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
      <Stack mt={1} px={2}>
        <Table size="small">
          <Stack divider={<Divider />} spacing={1.5}>
            {scannerStatus.scannerStatus.map(status => (
              <Box
                key={status.type}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <ScannerInfo name={status.type} />

                {status.on ? (
                  <Tooltip title="Konfigurert">
                    <CheckCircleOutlined color="success" />
                  </Tooltip>
                ) : (
                  <Tooltip title="Ikke konfigurert">
                    <CheckCircleOutlined color="error" />
                  </Tooltip>
                )}
              </Box>
            ))}
          </Stack>
        </Table>
      </Stack>
    </CardTitle>
  );
};

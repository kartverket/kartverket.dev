import { CheckCircleOutlined, HighlightOffOutlined } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import type { RepositoryScannerStatusData } from '../../typesFrontend';
import { CardTitle } from '../shared/CardTitle';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { ScannerInfo } from './ScannerInfo';
import Divider from '@mui/material/Divider';
import { StatusRow } from '../shared/StatusRow';

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
      <Stack
        divider={<Divider />}
        sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {scannerStatus.scannerStatus.map(status => (
          <StatusRow key={status.type}>
            <ScannerInfo name={status.type} />
            {status.on ? (
              <Tooltip title="Konfigurert">
                <CheckCircleOutlined color="success" />
              </Tooltip>
            ) : (
              <Tooltip title="Ikke konfigurert">
                <HighlightOffOutlined color="error" />
              </Tooltip>
            )}
          </StatusRow>
        ))}
      </Stack>
    </CardTitle>
  );
};

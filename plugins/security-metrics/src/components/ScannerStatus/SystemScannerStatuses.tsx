import {
  getAggregatedScannerStatus,
  getScannerStatusData,
} from '../../mapping/getScannerData';
import {
  AggregatedScannerStatus,
  RepositorySummary,
} from '../../typesFrontend';
import { CardTitle } from '../shared/CardTitle';
import { ScannerStatusDialog } from './SystemStatusDialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ScannerInfo } from './ScannerInfo';
import { useState } from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { StatusRow } from '../shared/StatusRow';

interface SystemScannerStatusProps {
  data: RepositorySummary[];
}

export const SystemScannerStatuses = ({ data }: SystemScannerStatusProps) => {
  const repositoryScannerStatus = getScannerStatusData(data);

  const [openDialogFor, setOpenDialogFor] = useState<string | null>(null);

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
      <Stack mt={1} pb={1} divider={<Divider />} sx={{ flex: 1 }}>
        {aggregatedStatus.map((status: AggregatedScannerStatus) => (
          <Box
            key={status.scannerName}
            sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <StatusRow onClick={() => setOpenDialogFor(status.scannerName)}>
              <ScannerInfo name={status.scannerName} />
              <Box display="flex" alignItems="center" gap={0.5} flexShrink={0}>
                <Typography variant="body2" fontWeight={500}>
                  {status.status}
                </Typography>
                <ChevronRightIcon
                  fontSize="small"
                  sx={{ color: 'text.secondary' }}
                />
              </Box>
            </StatusRow>
            <ScannerStatusDialog
              scannerStatus={status}
              isDialogOpen={openDialogFor === status.scannerName}
              setIsDialogOpen={open =>
                setOpenDialogFor(open ? status.scannerName : null)
              }
            />
          </Box>
        ))}
      </Stack>
    </CardTitle>
  );
};

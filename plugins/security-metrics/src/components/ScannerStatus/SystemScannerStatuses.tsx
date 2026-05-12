import {
  getAggregatedScannerStatus,
  getScannerStatusData,
} from '../../mapping/getScannerData';
import {
  AggregatedScannerStatus,
  RepositorySummary,
} from '../../typesFrontend';
import { CardTitle } from '../CardTitle';
import { ScannerStatusDialog } from './SystemStatusDialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ScannerInfo } from './ScannerInfo';
import { useState } from 'react';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

interface SystemScannerStatusProps {
  data: RepositorySummary[];
}

export const SystemScannerStatuses = ({ data }: SystemScannerStatusProps) => {
  const repositoryScannerStatus = getScannerStatusData(data);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      <Stack mt={1} px={2} pb={2} divider={<Divider flexItem />} spacing={1.5}>
        {aggregatedStatus.map((status: AggregatedScannerStatus) => (
          <Box
            key={status.scannerName}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
          >
            <ScannerInfo name={status.scannerName} />

            <Link component="button" onClick={() => setIsDialogOpen(true)}>
              <Typography variant="body2" fontWeight={500}>
                {status.status} komponenter
              </Typography>
            </Link>

            <ScannerStatusDialog
              scannerStatus={status}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
            />
          </Box>
        ))}
      </Stack>
    </CardTitle>
  );
};

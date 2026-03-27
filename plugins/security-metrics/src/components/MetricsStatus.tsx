import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useMetricsUpdateStatusQuery } from '../hooks/useMetricsUpdateStatusQuery';
import { MetricsUpdateStatus } from '../typesFrontend';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const SCANNER_LABELS: Record<keyof MetricsUpdateStatus, string> = {
  dependabot: 'Sårbarheter fra Dependabot',
  sysdig: 'Sårbarheter fra Sysdig',
  codeScanning: 'Sårbarheter fra Pharos og CodeQL',
  secretScanning: 'Eksponerte hemmeligheter',
  riscMetrics: 'Risiko- og sårbarhetsarbeid',
};

export const MetricsStatus = () => {
  const [open, setOpen] = useState(false);
  const { data, isPending, error } = useMetricsUpdateStatusQuery();

  if (isPending || error || !data) {
    return null;
  }

  const sources = Object.keys(data) as (keyof MetricsUpdateStatus)[];
  const outdatedCount = sources.filter(key => !data[key]).length;

  if (!outdatedCount) {
    return null;
  }

  return (
    <>
      <Tooltip
        title={`${outdatedCount} utdatert datakilde${outdatedCount > 1 ? 'r' : ''}`}
      >
        <IconButton color="warning" onClick={() => setOpen(true)}>
          <Badge badgeContent={outdatedCount} color="warning">
            <WarningAmberIcon sx={{ fontSize: 26 }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Status på oppdatering av metrikker
          <Tooltip
            arrow
            title={
              <Box sx={{ py: 0.5 }}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WarningAmberIcon fontSize="small" />
                    <Typography variant="body2">
                      Ikke oppdatert de siste 24 timene
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleOutlineIcon fontSize="small" />
                    <Typography variant="body2">
                      Oppdatert de siste 24 timene
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            }
          >
            <InfoIcon sx={{ ml: 1, fontSize: 20, color: 'text.secondary' }} />
          </Tooltip>
        </DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <List disablePadding>
            {sources.map(key => (
              <ListItem key={key} sx={{ p: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {data[key] ? (
                    <CheckCircleOutlineIcon fontSize="small" color="success" />
                  ) : (
                    <WarningAmberIcon fontSize="small" color="warning" />
                  )}
                </ListItemIcon>
                <ListItemText primary={SCANNER_LABELS[key]} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Lukk</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

import { useState } from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useMetricsUpdateStatusQuery } from '../../hooks/useMetricsUpdateStatusQuery';
import { MetricsUpdateStatus } from '../../typesFrontend';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const SCANNER_LABELS: Record<keyof MetricsUpdateStatus, string> = {
  dependabot: 'Dependabot',
  sysdig: 'Sysdig',
  codeScanning: 'CodeQL og Pharos',
  secretScanning: 'Hemmelighetsskanning',
  riscMetrics: 'RoS-metrikker',
};

export const MetricsUpdateStatusInfo = () => {
  const { data, isPending, error } = useMetricsUpdateStatusQuery();
  const [open, setOpen] = useState(false);

  if (isPending || error || !data) return null;

  const sources = Object.keys(data) as (keyof MetricsUpdateStatus)[];
  const outdatedSources = sources.filter(key => !data[key]);

  if (outdatedSources.length === 0) return null;

  return (
    <>
      <Button
        color="warning"
        startIcon={<WarningAmberIcon />}
        onClick={() => setOpen(true)}
        sx={{ justifyContent: 'flex-start', flex: 1 }}
      >
        Utdatert data
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Status på oppdatering av metrikker</DialogTitle>
        <DialogContent>
          <List dense disablePadding>
            {sources.map(key => (
              <ListItem key={key}>
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

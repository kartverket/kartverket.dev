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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { formatDate } from 'date-fns';
import { useMetricsUpdateStatusQuery } from '../../hooks/useMetricsUpdateStatusQuery';
import { MetricsUpdateStatus } from '../../typesFrontend';
import { isRecent } from '../../utils/isRecent';

const SCANNER_LABELS: Record<keyof MetricsUpdateStatus, string> = {
  dependabotLastUpdated: 'Sårbarheter fra Dependabot',
  sysdigLastUpdated: 'Sårbarheter fra Sysdig',
  codeScanningLastUpdated: 'Sårbarheter fra Pharos og CodeQL',
  secretScanningLastUpdated: 'Eksponerte hemmeligheter',
  riscMetricsLastUpdated: 'Status på risiko- og sårbarhetsarbeid',
};

interface MetricsStatusProps {
  entityName: string;
}

export const MetricsStatus = ({ entityName }: MetricsStatusProps) => {
  const [open, setOpen] = useState(false);
  const { data, isPending, error } = useMetricsUpdateStatusQuery(entityName);

  if (isPending || error || !data) {
    return null;
  }

  const sources = Object.keys(SCANNER_LABELS) as (keyof MetricsUpdateStatus)[];
  const outdatedCount = sources.filter(key => !isRecent(data[key], 0)).length;

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
        <DialogTitle>Status på oppdatering av metrikker</DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <List disablePadding>
            {sources.map(key => {
              const updated = isRecent(data[key], 0);
              const getSecondaryText = () => {
                if (updated) return 'Oppdatert i natt';
                if (data[key]) {
                  return `Oppdatert ${formatDate(new Date(data[key]), 'dd.MM.yyyy')}`;
                }
                return 'Aldri oppdatert';
              };
              return (
                <ListItem key={key} sx={{ p: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {updated ? (
                      <CheckCircleOutlineIcon
                        fontSize="small"
                        color="success"
                      />
                    ) : (
                      <WarningAmberIcon fontSize="small" color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={SCANNER_LABELS[key]}
                    secondary={getSecondaryText()}
                  />
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Lukk</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

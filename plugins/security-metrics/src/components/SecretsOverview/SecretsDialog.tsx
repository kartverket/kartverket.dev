import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';

import { SecretAlert } from '../../typesFrontend';
import { Secret } from './Secret';
import List from '@mui/material/List';

export interface Secrets {
  componentName: string;
  alerts: SecretAlert[];
}

export interface SecretProps {
  secretsOverviewData: Secrets[];
  openDialog: boolean;
  closeDialogBox: () => void;
}

export const SecretsDialog = ({
  secretsOverviewData,
  openDialog,
  closeDialogBox,
}: SecretProps) => {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={closeDialogBox}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">
        Eksponerte hemmeligheter
        <IconButton
          aria-label="close"
          onClick={closeDialogBox}
          sx={{
            position: 'absolute',
            right: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContent sx={{ p: 0 }}>
          <List sx={{ display: 'grid', gap: 3 }}>
            {secretsOverviewData.map(repo => (
              <div key={repo.componentName}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {repo.componentName}:
                </Typography>
                <Stack gap={2}>
                  {repo.alerts &&
                    repo.alerts.map((secret, index) => (
                      <Secret key={secret.summary + index} secret={secret} />
                    ))}
                </Stack>
              </div>
            ))}
          </List>
        </DialogContent>
      </DialogContent>
    </Dialog>
  );
};

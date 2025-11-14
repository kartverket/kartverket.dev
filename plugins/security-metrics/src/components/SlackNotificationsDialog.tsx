import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { SpinnerButton } from './VulnerabilityTable/AcceptRisk/SpinnerButton';
import TextField from '@mui/material/TextField';
import { useEntity } from '@backstage/plugin-catalog-react';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';
import { useConfigureSlackNotificationsQuery } from '../hooks/useConfigureSlackNotificationsQuery';

interface Props {
  openNotificationsDialog: boolean;
  handleCloseNotificationsDialog: () => void;
  channel: string;
  setChannel: React.Dispatch<React.SetStateAction<string>>;
  componentNames: string[];
}

export const SlackNotificationDialog = ({
  openNotificationsDialog,
  handleCloseNotificationsDialog,
  channel,
  setChannel,
  componentNames,
}: Props) => {
  const { entity } = useEntity();

  const [selectedComponents, setSelectedComponents] = useState(componentNames);

  const configureNotification = useConfigureSlackNotificationsQuery();

  const handleToggleComponent = (name: string, checked: boolean) => {
    setSelectedComponents(prev =>
      checked ? [...prev, name] : prev.filter(c => c !== name),
    );
  };

  const handleSave = () => {
    configureNotification.mutate(
      {
        teamName: entity.metadata.name,
        channelName: channel,
        componentNames: selectedComponents,
      },
      {
        onSuccess: () => {
          handleCloseNotificationsDialog();
        },
      },
    );
  };

  return (
    <Dialog
      open={openNotificationsDialog}
      onClose={handleCloseNotificationsDialog}
    >
      <DialogTitle>
        Konfigurer varsling for team {entity.metadata.name}
      </DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <Typography>Hvor ønsker du å varsles om nye sårbarheter?</Typography>
        <TextField
          label="Slack-kanal (uten #)"
          value={channel}
          onChange={e => setChannel(e.target.value)}
          fullWidth
        />

        <Typography variant="subtitle1">
          Huk av hvilke komponenter du ønsker å varsles om:
        </Typography>
        <FormGroup>
          {componentNames.map(name => (
            <FormControlLabel
              key={name}
              control={
                <Checkbox
                  checked={selectedComponents.includes(name)}
                  onChange={(_, checked) =>
                    handleToggleComponent(name, checked)
                  }
                />
              }
              label={name}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Box sx={{ pb: 2, pr: 2 }}>
          <Button onClick={handleCloseNotificationsDialog}>Avbryt</Button>
          <SpinnerButton
            variant="contained"
            loading={configureNotification.isPending}
            onClick={handleSave}
          >
            Lagre
          </SpinnerButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

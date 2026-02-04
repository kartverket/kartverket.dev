import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { SpinnerButton } from './VulnerabilityTable/ChangeStatus/SpinnerButton';
import TextField from '@mui/material/TextField';
import { useEntity } from '@backstage/plugin-catalog-react';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useEffect, useState } from 'react';
import { useConfigureSlackNotificationsQuery } from '../hooks/useConfigureSlackNotificationsQuery';
import { useSlackNotificationsConfigQuery } from '../hooks/useSlackNotificationsConfigQuery';

interface Props {
  openNotificationsDialog: boolean;
  handleCloseNotificationsDialog: () => void;
  channel: string;
  setChannel: React.Dispatch<React.SetStateAction<string>>;
  permittedComponents: string[];
  notPermitted: string[];
}

const SEVERITIES = [
  { value: 'critical', label: 'Kritisk' },
  { value: 'high', label: 'Høy' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Lav' },
  { value: 'negligible', label: 'Ubetydelig' },
  { value: 'unknown', label: 'Uvisst' },
];

export const SlackNotificationDialog = ({
  openNotificationsDialog,
  handleCloseNotificationsDialog,
  channel,
  setChannel,
  permittedComponents,
  notPermitted,
}: Props) => {
  const { entity } = useEntity();
  const teamName = entity.metadata.name;

  const configQuery = useSlackNotificationsConfigQuery(teamName);

  const [selectedComponents, setSelectedComponents] =
    useState(permittedComponents);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>(
    SEVERITIES.map(s => s.value),
  );

  useEffect(() => {
    if (!openNotificationsDialog) return;

    const config = configQuery.data;

    if (config) {
      setChannel(config.channelId);
      setSelectedComponents(config.componentNames);
      setSelectedSeverities(
        config.severity?.length
          ? config.severity
          : SEVERITIES.map(s => s.value),
      );
    } else {
      setSelectedComponents(permittedComponents);
      setSelectedSeverities(SEVERITIES.map(s => s.value));
    }
  }, [
    openNotificationsDialog,
    configQuery.data,
    permittedComponents,
    setChannel,
  ]);

  const configureNotification = useConfigureSlackNotificationsQuery();
  const [showChannelError, setShowChannelError] = useState(false);

  const handleToggleComponent = (name: string, checked: boolean) => {
    setSelectedComponents(prev =>
      checked ? [...prev, name] : prev.filter(c => c !== name),
    );
  };

  const handleToggleSeverity = (severity: string, checked: boolean) => {
    setSelectedSeverities(prev =>
      checked ? [...prev, severity] : prev.filter(s => s !== severity),
    );
  };

  const handleSave = () => {
    if (!channel.trim()) {
      setShowChannelError(true);
      return;
    }

    configureNotification.mutate(
      {
        teamName: entity.metadata.name,
        channelId: channel,
        componentNames: selectedComponents,
        severity: selectedSeverities,
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
      maxWidth="md"
      fullWidth
    >
      <DialogTitle bgcolor="#5eb67bff">
        Konfigurer slack-varsling for team {entity.metadata.name}
      </DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: '8px', pt: '10px' }}
        >
          <Typography>
            I hvilken kanal ønsker du å varsles om nye sårbarheter?
          </Typography>
          <Tooltip title="Slack-kanal-ID finner du i ønsket kanal under 'Open channel details'">
            <InfoOutlinedIcon
              fontSize="small"
              sx={{ color: 'text.secondary' }}
            />
          </Tooltip>
        </Box>
        <TextField
          label="Slack-kanal ID (Eks: G98XYZ1234)"
          value={channel}
          onChange={e => {
            setChannel(e.target.value);
            if (showChannelError) {
              setShowChannelError(false);
            }
          }}
          fullWidth
          required
          error={showChannelError}
          helperText={showChannelError ? 'Slack-kanal ID må oppgis' : ''}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography>
            NB! For å varsle i riktig Slack-kanal må appen “Sårbarhetsvarsler”
            være lagt til før du lagrer.
          </Typography>
          <Tooltip title="Tips: Gå til kanalen, skriv /add, og legg til appen.">
            <InfoOutlinedIcon
              fontSize="small"
              sx={{ color: 'text.secondary' }}
            />
          </Tooltip>
        </Box>

        <Typography variant="subtitle1">
          <b>Hvilke kritikaliteter vil du varsles om:</b>
        </Typography>
        <FormGroup
          row
          sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}
        >
          {SEVERITIES.map(severity => (
            <FormControlLabel
              key={severity.value}
              control={
                <Checkbox
                  checked={selectedSeverities.includes(severity.value)}
                  onChange={(_, checked) =>
                    handleToggleSeverity(severity.value, checked)
                  }
                />
              }
              label={severity.label}
            />
          ))}
        </FormGroup>

        <Typography variant="subtitle1">
          <b>Hvilke komponenter skal det varsles om:</b>
        </Typography>
        <FormGroup
          row
          sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}
        >
          {permittedComponents.map(name => (
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
          {notPermitted.map(name => (
            <FormControlLabel
              key={name}
              disabled
              control={<Checkbox checked={false} disabled />}
              label={name}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Box sx={{ pb: 2, pr: 2 }}>
          <Button
            sx={{ mr: '5px' }}
            variant="outlined"
            onClick={handleCloseNotificationsDialog}
          >
            Avbryt
          </Button>
          <SpinnerButton
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

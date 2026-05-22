import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import { StarFilterProps } from './ViewSettingsButton';

type Props = {
  open: boolean;
  onClose: () => void;
  starFilter?: StarFilterProps;
  showTotal: boolean;
  showOpen: boolean;
  onToggleShowTotal: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
  onToggleShowOpen: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
};

type SettingSwitchProps = {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
};

const SettingSwitch = ({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: SettingSwitchProps) => (
  <ListItem
    disableGutters
    secondaryAction={
      <Switch checked={checked} disabled={disabled} onChange={onChange} />
    }
  >
    <ListItemText primary={title} secondary={description} sx={{ pr: 6 }} />
  </ListItem>
);

export const ViewSettingsDialog = ({
  open,
  onClose,
  starFilter,
  showTotal,
  showOpen,
  onToggleShowTotal,
  onToggleShowOpen,
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tilpass visning</DialogTitle>

      <DialogContent>
        <List disablePadding>
          <SettingSwitch
            title="Vis bare åpne sårbarheter"
            description="Skjuler aksepterte sårbarheter fra de aggregerte visningene."
            checked={showOpen}
            onChange={onToggleShowOpen}
          />
          <Divider component="li" />
          <SettingSwitch
            title="Vis totalt antall i trendgrafen"
            description="Legger til totalt antall sårbarheter i trendgrafen, i tillegg til kritiske og høye sårbarheter."
            checked={showTotal}
            onChange={onToggleShowTotal}
          />
          {starFilter && (
            <>
              <Divider component="li" />
              <SettingSwitch
                title="Vis bare stjernemarkerte komponenter"
                description={
                  starFilter.hasStarred
                    ? 'Filtrerer oversikten til komponentene du har markert med stjerne.'
                    : 'Du har ingen stjernemarkerte komponenter ennå. Marker en komponent med stjerne i katalogen for å bruke dette filteret.'
                }
                checked={starFilter.effectiveFilter === 'starred'}
                disabled={!starFilter.hasStarred}
                onChange={starFilter.onToggleStarFilter}
              />
            </>
          )}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ p: 2 }}>
          Ferdig
        </Button>
      </DialogActions>
    </Dialog>
  );
};

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { formatDate } from 'date-fns';
import { Link } from '@backstage/core-components';
import { SecretAlert } from '../../typesFrontend';
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';

type Props = {
  secret: SecretAlert;
};

export const Secret = ({ secret }: Props) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <ListItem
      sx={{
        borderRadius: 1,
        backgroundColor: isDarkMode ? 'grey.900' : 'grey.100',
      }}
    >
      <Stack width="100%">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontWeight="bold">{secret.summary}</Typography>
          {secret.bypassed && (
            <Chip
              label="Omgått"
              sx={{
                m: 0,
              }}
            />
          )}
        </Stack>

        <Box color={isDarkMode ? 'grey.400' : 'grey.800'}>
          <Typography>{`Hemmelighet: ${secret.secretValue}`}</Typography>
          <Typography>
            Oppdaget: {formatDate(secret.createdAt, 'dd.MM.yyyy HH:mm')}
          </Typography>
          {secret.htmlUrl && (
            <Typography>
              GitHub-link:{' '}
              <Link to={new URL(secret.htmlUrl).href}>
                {new URL(secret.htmlUrl).href}
              </Link>
            </Typography>
          )}
          {secret.bypassedBy && (
            <Typography>
              {`Omgått av: ${secret.bypassedBy.name}`}{' '}
              {secret.bypassedBy.isRepositoryAdmin && '(Admin)'}
            </Typography>
          )}
        </Box>
      </Stack>
    </ListItem>
  );
};

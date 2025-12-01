import { SecurityChamp } from '../types';
import { useUserProfile } from '../hooks/useUserProfile';
import { Box } from '@mui/system';
import { CustomTooltip } from './LightTooltip';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import { UserEntity } from '@backstage/catalog-model';
import style from './securityCard.module.css';

const KVSecurityChampionItem = ({
  champion,
  selectedUser,
}: {
  champion: SecurityChamp;
  selectedUser?: UserEntity | null;
}) => {
  const { user, loading, error } = useUserProfile(
    champion.securityChampionEmail!,
  );

  if (loading && !selectedUser)
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar
          src={
            user?.spec.profile?.picture || selectedUser?.spec.profile?.picture
          }
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          user?.spec?.profile?.displayName ||
          selectedUser?.spec?.profile?.displayName ||
          champion.securityChampionEmail
        }
        secondary={
          user?.spec.profile?.email ||
          selectedUser?.spec.profile?.email ||
          'User not in catalog'
        }
      />
    </ListItem>
  );
};
const UnknownSecurityChampionItem = ({
  champion,
}: {
  champion: SecurityChamp;
}) => {
  return (
    <>
      <ListItemAvatar>
        <Avatar src="/broken-image.jpg" />
      </ListItemAvatar>
      <ListItemText primary={champion.securityChampionEmail} />
    </>
  );
};

export const SecurityChampionItem = ({
  champion,
  repositories,
  selectedUser,
}: {
  champion: SecurityChamp;
  repositories?: string[];
  selectedUser?: UserEntity | null;
}) => {
  return (
    <ListItem>
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          '@container securityChampionList (max-width: 500px)': {
            flexDirection: 'column',
            alignItems: 'baseline',
          },
        }}
        width="100%"
        justifyContent="space-between"
        divider={
          <Divider
            sx={{
              orientation: 'horisontal',
              '@container securityChampionList (max-width: 500px)': {
                orientation: 'vertical',
              },
            }}
            flexItem
          />
        }
      >
        {champion.securityChampionEmail && (
          <KVSecurityChampionItem
            champion={champion}
            selectedUser={selectedUser}
          />
        )}
        {!champion.securityChampionEmail && (
          <UnknownSecurityChampionItem champion={champion} />
        )}
        {repositories && (
          <CustomTooltip
            sx={{
              backgroundColor: 'var(--bui-bg-surface-1	)',
            }}
            title={
              <List>
                {repositories.map(repository => (
                  <ListItem key={repository}>
                    <Link
                      href={`/catalog/default/component/${repository}`}
                      target="_blank"
                    >
                      {repository}
                    </Link>
                  </ListItem>
                ))}
              </List>
            }
          >
            <IconButton color="primary">
              <Typography variant="body1">
                {repositories.length > 1
                  ? `${repositories.length} components`
                  : `${repositories.length} component`}
              </Typography>
            </IconButton>
          </CustomTooltip>
        )}
      </Stack>
    </ListItem>
  );
};

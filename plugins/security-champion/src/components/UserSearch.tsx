import { UserEntity } from '@backstage/catalog-model';
import { SearchField } from '@backstage/ui';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { useUserSearch } from '../hooks/useUserSearch';

type UserSearchProps = {
  selectedUser: UserEntity | null;
  onSelect: (user: UserEntity) => void;
};

export const UserSearch = ({ selectedUser, onSelect }: UserSearchProps) => {
  const [query, setQuery] = useState('');
  const { users, isLoading } = useUserSearch(query);

  return (
    <div>
      <SearchField
        placeholder="Search for user..."
        onChange={setQuery}
        value={query}
      />

      {selectedUser && !query && (
        <ListItem>
          <ListItemAvatar>
            <Avatar src={selectedUser.spec.profile?.picture} />
          </ListItemAvatar>
          <ListItemText
            primary={selectedUser.spec.profile?.displayName}
            secondary={selectedUser.spec.profile?.email}
          />
        </ListItem>
      )}

      {query.length >= 2 && (
        <Paper sx={{ maxHeight: 300, overflow: 'auto', mt: '2px' }}>
          {isLoading ? (
            <CircularProgress size={20} sx={{ m: 1 }} />
          ) : (
            <List>
              {users.map(user => (
                <ListItemButton
                  key={user.spec.profile?.email ?? user.metadata.uid}
                  onClick={() => {
                    onSelect(user);
                    setQuery('');
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={user.spec.profile?.picture} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.spec.profile?.displayName}
                    secondary={user.spec.profile?.email}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Paper>
      )}
    </div>
  );
};

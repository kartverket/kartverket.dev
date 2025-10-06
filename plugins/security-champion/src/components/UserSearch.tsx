import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { UserEntity } from '@backstage/catalog-model';
import { SearchField } from '@backstage/ui';

interface UserSearchProps {
  selectedUser: UserEntity | null;
  setSelectedUser: Dispatch<SetStateAction<UserEntity | null>>;
}

export const UserSearch = ({
  setSelectedUser,
  selectedUser,
}: UserSearchProps) => {
  const [users, setUsers] = useState<UserEntity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const catalogApi = useApi(catalogApiRef);

  useEffect(() => {
    const fetchUsers = async () => {
      const results = await catalogApi.getEntities({
        filter: { kind: 'User' },
      });

      setUsers(results.items as UserEntity[]);
    };
    fetchUsers();
  }, [catalogApi]);

  const filteredUsers = users.filter(user => {
    const email = user?.spec.profile?.email?.toLowerCase() || '';
    const displayName = user.spec?.profile?.displayName?.toLowerCase() || '';
    return (
      email.includes(searchQuery.toLowerCase()) ||
      displayName.includes(searchQuery.toLowerCase())
    );
  });

  const showSelectedUser = () => {
    if (selectedUser) {
      return (
        <ListItem>
          <ListItemAvatar>
            <Avatar src={selectedUser?.spec.profile?.picture} />
          </ListItemAvatar>
          <ListItemText
            primary={selectedUser?.spec?.profile?.displayName}
            secondary={selectedUser?.spec.profile?.email}
          />
        </ListItem>
      );
    }
    return <></>;
  };

  return (
    <div>
      <SearchField
        placeholder="Search..."
        onChange={input => setSearchQuery(input)}
        value={searchQuery}
      />
      {searchQuery ? (
        <Paper style={{ maxHeight: 300, overflow: 'auto', margin: '2px' }}>
          <List>
            {filteredUsers.map((user, idx) => (
              <ListItemButton
                key={idx}
                onClick={() => {
                  setSelectedUser(user);
                  setSearchQuery('');
                }}
              >
                <ListItemAvatar>
                  <Avatar src={user?.spec.profile?.picture} />
                </ListItemAvatar>
                <ListItemText
                  primary={user?.spec?.profile?.displayName}
                  secondary={user?.spec.profile?.email}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      ) : (
        <div>{showSelectedUser()}</div>
      )}
    </div>
  );
};

export default UserSearch;

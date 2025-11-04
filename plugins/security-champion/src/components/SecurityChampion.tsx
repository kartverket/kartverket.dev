import { useMemo, useState } from 'react';
import { ErrorBanner } from './ErrorBanner';
import { SecurityChamp, SecurityChampionBatchUpdate } from '../types';
import { SecurityChampionItem } from './SecurityChampionItem';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { useSecurityChampionsQuery } from '../hooks/useSecurityChampionsQuery';
import UserSearch from './UserSearch';
import { useSetSecurityChampionMutation } from '../hooks/useChangeSecurityChampionsQuery';
import { Button } from '@backstage/ui';
import { UserEntity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useSetMultipleSecurityChampionsMutation } from '../hooks/useChangeMultipleSecurityChampionsQuery';

const CardWrapper = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader sx={{ mb: 2 }} title={title} />

    <Divider />
    <CardContent>{children}</CardContent>
  </Card>
);

interface SecurityChampionProps {
  repositoryNames: string[];
}

export const SecurityChampion = ({
  repositoryNames,
}: SecurityChampionProps) => {
  const { data, isPending, error, refetch } =
    useSecurityChampionsQuery(repositoryNames);

  const [edit, setEdit] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
  const securityChampionMutation = useSetSecurityChampionMutation();
  const securityChampionForMultipleReposMutation =
    useSetMultipleSecurityChampionsMutation();
  const [isMutationError, setIsMutationError] = useState<boolean>(false);

  const { entity } = useEntity();

  const groupedChampions: Map<
    string,
    { champ: SecurityChamp; repositoryNames: string[] }
  > = useMemo(() => {
    if (data && data?.length < 2) return new Map(); // no need to group
    const champMap = new Map<
      string,
      { champ: SecurityChamp; repositoryNames: string[] }
    >();
    data?.forEach(champ => {
      const repositories = champMap.get(
        champ.securityChampionEmail.toLowerCase(),
      );
      if (repositories) {
        repositories.repositoryNames.push(champ.repositoryName);
      } else {
        champMap.set(champ.securityChampionEmail.toLowerCase(), {
          champ,
          repositoryNames: [champ.repositoryName],
        });
      }
    });
    return champMap;
  }, [data]);

  const setSecurityChampion = () => {
    if (selectedUser && selectedUser.spec.profile?.email) {
      if (repositoryNames.length === 1) {
        const champion: SecurityChamp = {
          repositoryName: repositoryNames[0],
          securityChampionEmail: selectedUser.spec.profile?.email,
        };
        securityChampionMutation.mutate(champion, {
          onSuccess: () => {
            refetch();
            setEdit(false);
            setSelectedUser(null);
          },
          onError: () => {
            setIsMutationError(true);
          },
        });
      } else {
        const secChampBatch: SecurityChampionBatchUpdate = {
          repositoryNames: repositoryNames,
          securityChampionEmail: selectedUser.spec.profile?.email,
        };
        securityChampionForMultipleReposMutation.mutate(secChampBatch);
      }
    }
  };

  const onEdit = () => {
    setEdit(!edit);
  };

  if (edit) {
    return (
      <CardWrapper title="Change security champion:">
        <UserSearch
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />

        {isMutationError && (
          <ErrorBanner errorMessage="Failed to set security champion" />
        )}

        <Button
          style={{
            marginTop: 8,
            backgroundColor: selectedUser ? '' : 'var(--bui-bg-solid-disabled)',
          }}
          onClick={setSecurityChampion}
          isDisabled={!selectedUser}
        >
          Confirm change
        </Button>
      </CardWrapper>
    );
  }

  if (isPending)
    return (
      <CardWrapper title="Security champion: ">
        <CircularProgress />
      </CardWrapper>
    );

  const renderSecurityChampions = () => {
    if (data && data.length < 1) {
      return <Typography>No security champion</Typography>;
    }
    if (data && data.length < 2) {
      return <SecurityChampionItem key={0} champion={data[0]} />;
    }
    return [...groupedChampions].map((element, index) => (
      <SecurityChampionItem
        key={index}
        champion={element[1].champ}
        repositories={element[1].repositoryNames}
      />
    ));
  };

  if (data) {
    return (
      <CardWrapper
        title={
          groupedChampions.size > 1
            ? 'Security champions: '
            : 'Security champion: '
        }
      >
        <List>
          <List>{renderSecurityChampions()}</List>
        </List>
        {(entity.kind === 'Component' || 'System') && (
          <Button onClick={onEdit}>Edit</Button>
        )}
      </CardWrapper>
    );
  }

  return (
    <CardWrapper title="Security champion: ">
      <ErrorBanner errorMessage={error?.message} />
    </CardWrapper>
  );
};

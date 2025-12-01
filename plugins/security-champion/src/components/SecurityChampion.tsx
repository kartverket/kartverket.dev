import { ErrorBanner } from './ErrorBanner';
import { SecurityChamp, SecurityChampionBatchUpdate } from '../types';
import { SecurityChampionItem } from './SecurityChampionItem';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import { useSecurityChampionsQuery } from '../hooks/useSecurityChampionsQuery';
import UserSearch from './UserSearch';
import { useSetSecurityChampionMutation } from '../hooks/useChangeSecurityChampionsQuery';
import { Button } from '@backstage/ui';
import { UserEntity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useSetMultipleSecurityChampionsMutation } from '../hooks/useChangeMultipleSecurityChampionsQuery';
import { MissingReposItem } from './MissingReposItem';
import Alert from '@mui/material/Alert';
import { useMemo, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const CardWrapper = ({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action: React.ReactNode;
}) => (
  <Card>
    <CardHeader sx={{ mb: 2 }} title={title} action={action} />

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
  const { data, isPending, refetch } =
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

    if (!data) return champMap;
    data?.forEach(champ => {
      if (!champ.securityChampionEmail) return;
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

  const generateSecurityChampionCSV = (
    groupOfChampions: Map<
      string,
      { champ: SecurityChamp; repositoryNames: string[] }
    >,
  ) => {
    const csvRows = [];
    csvRows.push(['security champion', 'repositories']);
    groupOfChampions.forEach((value, key) => {
      csvRows.push([key, value.repositoryNames.join(';')]);
    });

    let csvContent = '';

    csvRows.forEach(row => {
      csvContent += `${row.join(',')}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' });
    const objUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', objUrl);
    link.setAttribute('download', 'list_of_security_champions.csv');
    link.click();
  };

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
        securityChampionForMultipleReposMutation.mutate(secChampBatch, {
          onSuccess: () => {
            refetch();
            setEdit(false);
          },
          onError: () => {
            setIsMutationError(true);
          },
        });
      }
    }
  };

  const onEdit = () => {
    setSelectedUser(null);
    setEdit(!edit);
  };

  if (edit) {
    return (
      <CardWrapper
        title={
          entity.kind === 'Component'
            ? 'Change security champion'
            : `Change security champion for all components in this ${entity.kind.toLowerCase()}`
        }
        action={
          <IconButton
            disabled
            aria-label="Download a CSV file containing all security champions for this entity."
            aria-description="Download is disabled because there is only one security champion with one component, or no security champions available."
            onClick={() => generateSecurityChampionCSV(groupedChampions)}
          >
            <DownloadIcon />
          </IconButton>
        }
      >
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
      <CardWrapper
        title="Security champion: "
        action={
          <IconButton
            disabled
            aria-label="Download a CSV file containing all security champions for this entity."
            aria-description="Download is disabled because there is only one security champion with one component, or no security champions available."
            onClick={() => generateSecurityChampionCSV(groupedChampions)}
          >
            <DownloadIcon />
          </IconButton>
        }
      >
        <CircularProgress />
      </CardWrapper>
    );

  const renderSecurityChampions = () => {
    if (data && data.length === 0 && repositoryNames.length > 1) {
      return (
        <MissingReposItem
          reposWithSecChamps={[]}
          allRepositories={repositoryNames}
        />
      );
    }
    if (data && data.length === 0 && repositoryNames.length === 1) {
      return <Alert severity="warning">Missing security champion</Alert>;
    }
    if (data && data.length === 1) {
      return (
        <>
          <SecurityChampionItem
            key={0}
            champion={data[0]}
            repositories={[data[0].repositoryName]}
            selectedUser={selectedUser}
          />
          <MissingReposItem
            reposWithSecChamps={[data[0].repositoryName]}
            allRepositories={repositoryNames}
          />
        </>
      );
    }
    return (
      <>
        {[...groupedChampions].map((element, index) => (
          <SecurityChampionItem
            key={index}
            champion={element[1].champ}
            repositories={element[1].repositoryNames}
          />
        ))}
        <MissingReposItem
          reposWithSecChamps={Array.from(groupedChampions.values()).flatMap(
            e => e.repositoryNames,
          )}
          allRepositories={repositoryNames}
        />
      </>
    );
  };

  if (data) {
    return (
      <CardWrapper
        title={
          groupedChampions.size > 1
            ? 'Security champions: '
            : 'Security champion: '
        }
        action={
          <Tooltip title="Download CSV">
            <IconButton
              aria-label="Download a CSV file containing all security champions for this entity."
              aria-description="Download is disabled because there is only one security champion with one component, or no security champions available."
              disabled={groupedChampions.size === 0}
              onClick={() => {
                generateSecurityChampionCSV(groupedChampions);
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        }
      >
        <List>
          <List
            sx={{
              containerType: 'inline-size', // enable container queries
              containerName: 'securityChampionList',
            }}
          >
            {renderSecurityChampions()}
          </List>
        </List>
        {(entity.kind === 'Component' ||
          entity.kind === 'System' ||
          entity.kind === 'Group') && (
          <Button onClick={onEdit}>
            {entity.kind === 'Component' ? 'Edit' : 'Edit all'}
          </Button>
        )}
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      title="Security champion: "
      action={
        <IconButton
          disabled
          aria-label="Download a CSV file containing all security champions for this entity."
          aria-description="Download is disabled because there is only one security champion with one component, or no security champions available."
          onClick={() => generateSecurityChampionCSV(groupedChampions)}
        >
          <DownloadIcon />
        </IconButton>
      }
    >
      <ErrorBanner errorMessage="Kunne ikke koble til security champion API" />
    </CardWrapper>
  );
};

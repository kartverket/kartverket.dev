import { UserEntity } from '@backstage/catalog-model';
import { Button } from '@backstage/ui';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import { SecurityChamp } from '../types';
import { MissingReposItem } from './MissingReposItem';
import { SecurityChampionItem } from './SecurityChampionItem';

type ChampionGroup = Map<string, { champ: SecurityChamp; repositoryNames: string[] }>;

interface SecurityChampionListViewProps {
  data: SecurityChamp[];
  groupedChampions: ChampionGroup;
  repositoryNames: string[];
  reposWithNoSecChamps: string[];
  selectedUser: UserEntity | null;
  entityKind: string;
  onEdit: () => void;
  onEditMissing: () => void;
  onDownloadCsv: () => void;
}

export const SecurityChampionListView = ({
  data,
  groupedChampions,
  repositoryNames,
  reposWithNoSecChamps,
  selectedUser,
  entityKind,
  onEdit,
  onEditMissing,
  onDownloadCsv,
}: SecurityChampionListViewProps) => {
  const renderChampions = () => {
    if (data.length === 0 && repositoryNames.length > 1) {
      return (
        <MissingReposItem reposWithSecChamps={[]} allRepositories={repositoryNames} />
      );
    }
    if (data.length === 0) {
      return <Alert severity="warning">Missing security champion</Alert>;
    }
    if (data.length === 1) {
      return (
        <>
          <SecurityChampionItem
            key={data[0].repositoryName}
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
        {[...groupedChampions].map(([email, { champ, repositoryNames: repos }]) => (
          <SecurityChampionItem
            key={email}
            champion={champ}
            repositories={repos}
            selectedUser={selectedUser}
          />
        ))}
        <MissingReposItem
          reposWithSecChamps={[...groupedChampions.values()].flatMap(e => e.repositoryNames)}
          allRepositories={repositoryNames}
        />
      </>
    );
  };

  const canEdit = entityKind === 'Component' || entityKind === 'System' || entityKind === 'Group';

  return (
    <>
      {groupedChampions.size > 0 && (
        <Tooltip title="Download CSV">
          <IconButton
            aria-label="Download a CSV file with all security champions"
            onClick={onDownloadCsv}
            sx={{ float: 'right' }}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      )}

      <List
        sx={{
          containerType: 'inline-size',
          containerName: 'securityChampionList',
        }}
      >
        {renderChampions()}
      </List>

      <Stack direction="row" spacing={1}>
        {canEdit && (
          <Button onClick={onEdit}>
            {entityKind === 'Component' ? 'Edit' : 'Edit all'}
          </Button>
        )}
        {(entityKind === 'System' || entityKind === 'Group') &&
          reposWithNoSecChamps.length > 0 && (
            <Button onClick={onEditMissing}>Edit missing</Button>
          )}
      </Stack>
    </>
  );
};

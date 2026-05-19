import { UserEntity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { useMemo, useState } from 'react';
import { useSetMultipleSecurityChampionsMutation } from '../hooks/useChangeMultipleSecurityChampionsQuery';
import { useSetSecurityChampionMutation } from '../hooks/useChangeSecurityChampionsQuery';
import { useSecurityChampionsQuery } from '../hooks/useSecurityChampionsQuery';
import { SecurityChamp, SecurityChampionBatchUpdate } from '../types';
import { exportSecurityChampionsAsCsv } from '../utils/exportSecurityChampionsCsv';
import { ErrorBanner } from './ErrorBanner';
import { SecurityChampionEditForm } from './SecurityChampionEditForm';
import { SecurityChampionListView } from './SecurityChampionListView';

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
  const { data, isPending, refetch } =
    useSecurityChampionsQuery(repositoryNames);
  const { entity } = useEntity();

  const [edit, setEdit] = useState(false);
  const [editMissing, setEditMissing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
  const [isMutationError, setIsMutationError] = useState(false);

  const singleMutation = useSetSecurityChampionMutation();
  const batchMutation = useSetMultipleSecurityChampionsMutation();

  const groupedChampions = useMemo(() => {
    const map = new Map<
      string,
      { champ: SecurityChamp; repositoryNames: string[] }
    >();
    if (!data || data.length < 2) return map;
    data.forEach(champ => {
      if (!champ.securityChampionEmail) return;
      const key = champ.securityChampionEmail.toLowerCase();
      const entry = map.get(key);
      if (entry) {
        entry.repositoryNames.push(champ.repositoryName);
      } else {
        map.set(key, { champ, repositoryNames: [champ.repositoryName] });
      }
    });
    return map;
  }, [data]);

  const reposWithSecChamps = [...groupedChampions.values()].flatMap(
    e => e.repositoryNames,
  );
  const reposWithNoSecChamps = repositoryNames.filter(
    r => !reposWithSecChamps.includes(r),
  );

  const onConfirm = () => {
    if (!selectedUser?.spec.profile?.email) return;
    const email = selectedUser.spec.profile.email;
    const onSuccess = () => {
      refetch();
      setEdit(false);
      setEditMissing(false);
      setSelectedUser(null);
    };
    const onError = () => setIsMutationError(true);

    if (repositoryNames.length === 1) {
      singleMutation.mutate(
        { repositoryName: repositoryNames[0], securityChampionEmail: email },
        { onSuccess, onError },
      );
    } else {
      const batch: SecurityChampionBatchUpdate = {
        repositoryNames: editMissing ? reposWithNoSecChamps : repositoryNames,
        securityChampionEmail: email,
      };
      batchMutation.mutate(batch, { onSuccess, onError });
    }
  };

  const editTitle = () => {
    if (entity.kind === 'Component') return 'Change security champion';
    if (editMissing)
      return `Set security champion for components without one in this ${entity.kind.toLowerCase()}`;
    return `Change security champion for all components in this ${entity.kind.toLowerCase()}`;
  };

  if (data?.length === 1 && data[0].repositoryName === '') return null;

  if (isPending)
    return (
      <CardWrapper title="Security champion:">
        <CircularProgress />
      </CardWrapper>
    );

  if (!data)
    return (
      <CardWrapper title="Security champion:">
        <ErrorBanner errorMessage="Kunne ikke koble til security champion API" />
      </CardWrapper>
    );

  const title =
    groupedChampions.size > 1 ? 'Security champions:' : 'Security champion:';

  return (
    <CardWrapper title={edit ? editTitle() : title}>
      {edit ? (
        <SecurityChampionEditForm
          title="Confirm change"
          selectedUser={selectedUser}
          onSelect={setSelectedUser}
          isMutationError={isMutationError}
          onConfirm={onConfirm}
          onCancel={() => {
            setEdit(false);
            setEditMissing(false);
            setSelectedUser(null);
          }}
          onDownloadCsv={() => exportSecurityChampionsAsCsv(groupedChampions)}
        />
      ) : (
        <SecurityChampionListView
          data={data}
          groupedChampions={groupedChampions}
          repositoryNames={repositoryNames}
          reposWithNoSecChamps={reposWithNoSecChamps}
          selectedUser={selectedUser}
          entityKind={entity.kind}
          onEdit={() => {
            setSelectedUser(null);
            setEdit(true);
          }}
          onEditMissing={() => {
            setEdit(true);
            setEditMissing(true);
          }}
          onDownloadCsv={() => exportSecurityChampionsAsCsv(groupedChampions)}
        />
      )}
    </CardWrapper>
  );
};

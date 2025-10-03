import { useMemo } from 'react';
import { ErrorBanner } from './ErrorBanner';
import { SecurityChamp } from '../typesFrontend';
import { SecurityChampionItem } from './SecurityChampionItem';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { useSecurityChampionsQuery } from '../hooks/useSecurityChampionsQuery';

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
  const { data, isPending, error } = useSecurityChampionsQuery(repositoryNames);

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
      const repositories = champMap.get(champ.securityChampionHandle);
      if (repositories) {
        repositories.repositoryNames.push(champ.repositoryName);
      } else {
        champMap.set(champ.securityChampionHandle, {
          champ,
          repositoryNames: [champ.repositoryName],
        });
      }
    });
    return champMap;
  }, [data]);

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
          groupedChampions.keys.length > 1
            ? 'Security champions: '
            : 'Security champion: '
        }
      >
        <List>
          <List>{renderSecurityChampions()}</List>
        </List>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper title="Security champion: ">
      <ErrorBanner errorMessage={error?.message} />
    </CardWrapper>
  );
};

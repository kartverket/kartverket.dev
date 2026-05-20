import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useOwnerMetrics } from '../../hooks/useOwnerMetrics';
import { useEntity } from '@backstage/plugin-catalog-react';
import { NoAccessRow } from '../RepositoriesTable/NoAccessRow';
import { OwnerTableRow } from './OwnerTableRow';
import { getTotalVulnerabilityCount } from '../../mapping/getSeverityCounts';

import { Progress } from '@backstage/core-components';
import Alert from '@mui/material/Alert';
import { ErrorBanner } from '../ErrorBanner';

export const OwnerTable = ({ onNavigate }: { onNavigate: () => void }) => {
  const { entity } = useEntity();

  const { data, isLoading, isEmpty, error, errorTitle } =
    useOwnerMetrics(entity);

  if (error) {
    return <ErrorBanner errorTitle={errorTitle} errorMessage={error.message} />;
  }

  if (isLoading || !data) return <Progress />;

  console.log('owner metrics', data);

  if (isEmpty) {
    return (
      <Alert severity="info">
        Finner ingen komponenter som har sikkerhetsmetrikker
      </Alert>
    );
  }

  const highestVulnerabilityCount =
    data?.permittedTeams?.reduce(
      (max, s) => Math.max(max, getTotalVulnerabilityCount(s.severityCount)),
      0,
    ) ?? 0;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: '900px' }} size="small">
        <TableHead>
          <TableRow>
            <TableCell width="20%">Eier</TableCell>
            <TableCell width="50%">Sårbarheter</TableCell>
            <TableCell width="30%" />
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.permittedTeams
            ?.sort(
              (a, b) =>
                getTotalVulnerabilityCount(b.severityCount) -
                getTotalVulnerabilityCount(a.severityCount),
            )
            .map(teams => {
              return (
                <OwnerTableRow
                  key={teams.team}
                  teamId={teams.team}
                  severityCount={teams.severityCount}
                  highestVulnerabilityCount={highestVulnerabilityCount}
                  onNavigate={onNavigate}
                />
              );
            })}
          {data?.notPermittedTeams?.map(teams => {
            return <NoAccessRow repositoryName={teams} />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

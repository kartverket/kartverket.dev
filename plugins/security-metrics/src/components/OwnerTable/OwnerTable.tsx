import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useOwnerMetrics } from '../../hooks/useOwnerMetrics';
import { useEntity } from '@backstage/plugin-catalog-react';
import { NoAccessOwnerRow, OwnerTableRow } from './OwnerTableRow';
import { getTotalVulnerabilityCount } from '../../mapping/getSeverityCounts';

import { Progress } from '@backstage/core-components';
import Alert from '@mui/material/Alert';
import { ErrorBanner } from '../shared/ErrorBanner';

export const OwnerTable = ({ onNavigate }: { onNavigate: () => void }) => {
  const { entity } = useEntity();

  const { data, isLoading, isEmpty, error, errorTitle } =
    useOwnerMetrics(entity);

  if (error) {
    return <ErrorBanner errorTitle={errorTitle} errorMessage={error.message} />;
  }

  if (isLoading || !data) return <Progress />;

  if (isEmpty) {
    return (
      <Alert severity="info">
        Finner ingen komponenter som har sikkerhetsmetrikker
      </Alert>
    );
  }

  const highestVulnerabilityCount =
    data?.permittedOwnerMetrics?.reduce(
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
          {data?.permittedOwnerMetrics
            ?.sort(
              (a, b) =>
                getTotalVulnerabilityCount(b.severityCount) -
                getTotalVulnerabilityCount(a.severityCount),
            )
            .map(ownerMetrics => {
              return (
                <OwnerTableRow
                  key={ownerMetrics.owner}
                  ownerId={ownerMetrics.owner}
                  severityCount={ownerMetrics.severityCount}
                  highestVulnerabilityCount={highestVulnerabilityCount}
                  onNavigate={onNavigate}
                />
              );
            })}
          {data?.notPermittedOwners?.map(owner => {
            return <NoAccessOwnerRow key={owner} ownerId={owner} />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

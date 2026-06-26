import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { getTotalVulnerabilityCount } from '../../mapping/getSeverityCounts';
import { SystemSeverityCounts } from '../../typesFrontend';
import { SystemsTableRow } from './SystemsTableRow';

type Props = {
  data: SystemSeverityCounts[];
  showOpen: boolean;
};

export const SystemsTable = ({ data, showOpen }: Props) => {
  const sortedSystems = [...data]
    .map(system => ({
      systemName: system.systemName,
      severityCount: showOpen ? system.openSeverityCount : system.severityCount,
      notPermittedCount: system.notPermittedComponents.length,
    }))
    .sort(
      (a, b) =>
        getTotalVulnerabilityCount(b.severityCount) -
        getTotalVulnerabilityCount(a.severityCount),
    );

  const highestVulnerabilityCount = sortedSystems.reduce(
    (max, s) => Math.max(max, getTotalVulnerabilityCount(s.severityCount)),
    0,
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: '900px' }} size="small">
        <TableHead>
          <TableRow>
            <TableCell width="20%">System</TableCell>
            <TableCell width="50%">
              {showOpen ? 'Åpne sårbarheter' : 'Sårbarheter'}
            </TableCell>
            <TableCell width="30%" />
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedSystems.map(system => (
            <SystemsTableRow
              key={system.systemName}
              systemName={system.systemName}
              hasPermittedMetrics={
                getTotalVulnerabilityCount(system.severityCount) > 0 ||
                system.notPermittedCount === 0
              }
              notPermittedCount={system.notPermittedCount}
              severityCount={system.severityCount}
              highestVulnerabilityCount={highestVulnerabilityCount}
              noSystemComponents={[]}
              showOpen={showOpen}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

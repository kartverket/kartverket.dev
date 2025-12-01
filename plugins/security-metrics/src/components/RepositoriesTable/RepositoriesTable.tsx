import { usePaginationProps } from '../../hooks/usePagination';
import { getTotalVulnerabilityCount } from '../../mapping/getSeverityCounts';
import type { RepositorySummary } from '../../typesFrontend';
import { RepositoriesTableRow } from './RepositoriesTableRow';
import InfoIcon from '@mui/icons-material/Info';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import { NoAccessRow } from './NoAccessRow';

type Props = {
  data: RepositorySummary[];
  notPermittedComponents: string[];
};

export const RepositoriesTable = ({ data, notPermittedComponents }: Props) => {
  const getCombinedVulnerabilityCount = (repo: RepositorySummary): number => {
    return getTotalVulnerabilityCount(repo.severityCount);
  };
  const sortedRepositories = [...data].sort(
    (a, b) =>
      getCombinedVulnerabilityCount(b) - getCombinedVulnerabilityCount(a),
  );
  const allRows = [...sortedRepositories, ...notPermittedComponents];

  const highestVulnerabilityCount = data.reduce((max, repo) => {
    const severitySum = getTotalVulnerabilityCount(repo.severityCount);
    return Math.max(max, severitySum);
  }, 0);

  const paginationProps = usePaginationProps(sortedRepositories.length);
  const { page, rowsPerPage } = paginationProps;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: '900px' }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Komponent</TableCell>
            <TableCell>Publisert RoS</TableCell>
            <TableCell>
              <Box display="flex" alignItems="center" gap={1}>
                Oppdatering av RoS
                <Tooltip title="Estimat basert på tidspunktet RoSen sist ble oppdatert og antall endringer etter RoSen sist ble oppdatert">
                  <InfoIcon fontSize="small" />
                </Tooltip>
              </Box>
            </TableCell>
            <TableCell>
              <Box display="flex" alignItems="center" gap={1}>
                MTTH
                <Tooltip title="Mean time to handle: gjennomsnittlig antall dager siden en sårbarhet ble oppdaget, fram til den blir løst eller akseptert – eller til dagens dato hvis den fortsatt er åpen">
                  <InfoIcon fontSize="small" />
                </Tooltip>
              </Box>
            </TableCell>
            <TableCell>Inaktive skannere</TableCell>
            <TableCell width="30%">Sårbarheter</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allRows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(row =>
              typeof row === 'string' ? (
                <NoAccessRow key={row} repositoryName={row} />
              ) : (
                <RepositoriesTableRow
                  key={row.componentName}
                  repository={row}
                  highestVulnerabilityCount={highestVulnerabilityCount}
                />
              ),
            )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={7}
              {...paginationProps}
              count={allRows.length}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

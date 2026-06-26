import { usePaginationProps } from '../../hooks/usePagination';
import { getTotalVulnerabilityCount } from '../../mapping/getSeverityCounts';
import type { ComponentMetricsSummary } from '../../typesFrontend';
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
  data: ComponentMetricsSummary[];
  showOpen: boolean;
  notPermittedComponents: string[];
};

export const RepositoriesTable = ({
  data,
  showOpen,
  notPermittedComponents,
}: Props) => {
  const getVulnerabilityCount = (repo: ComponentMetricsSummary): number => {
    return getTotalVulnerabilityCount(
      showOpen ? repo.openSeverityCount : repo.severityCount,
    );
  };
  const sortedRepositories = [...data].sort(
    (a, b) => getVulnerabilityCount(b) - getVulnerabilityCount(a),
  );
  const allRows = [...sortedRepositories, ...notPermittedComponents];

  const highestVulnerabilityCount = data.reduce((max, repo) => {
    return Math.max(max, getVulnerabilityCount(repo));
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
                Sist oppdatert RoS
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
            <TableCell width="30%">
              {showOpen ? 'Åpne sårbarheter' : 'Sårbarheter'}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allRows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(row =>
              typeof row === 'string' ? (
                <NoAccessRow key={row} name={row} />
              ) : (
                <RepositoriesTableRow
                  key={row.repoName}
                  repository={row}
                  highestVulnerabilityCount={highestVulnerabilityCount}
                  showOpen={showOpen}
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

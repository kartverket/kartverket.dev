import { useMemo, useState } from 'react';
import type {
  AggregatedVulnerability,
  ContextFacet,
  Severity,
} from '../../typesFrontend';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UniqueVulnerabilitiesTableRow } from './UniqueVulnerabilitiesTableRow';
import { ContextDescriptions } from '../VulnerabilityTable/ContextDescriptions';
import { CONTEXT_FACETS } from '../shared/contextDescriptions';
import { UniqueVulnerabilitiesFilters } from './UniqueVulnerabilitiesFilters';
import {
  compareByAffectedComponents,
  compareByPriority,
  compareBySeverity,
  matchesSearch,
  SortOrder,
  SortType,
} from './utils';

type Props = {
  data: AggregatedVulnerability[];
  showOpen: boolean;
};

export const UniqueVulnerabilitiesTable = ({ data, showOpen }: Props) => {
  const [sortType, setSortType] = useState<SortType>('Prioritet');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity[]>([]);
  const [contextFilter, setContextFilter] = useState<ContextFacet[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const visibleVulnerabilities = useMemo(() => {
    if (!showOpen) {
      return data;
    }

    return data
      .map(vulnerability => ({
        ...vulnerability,
        affectedComponents: vulnerability.affectedComponents.filter(
          component => component.status !== 'AKSEPTERT',
        ),
      }))
      .filter(vulnerability => vulnerability.affectedComponents.length > 0);
  }, [data, showOpen]);

  const filteredVulnerabilities = useMemo(
    () =>
      visibleVulnerabilities.filter(vulnerability => {
        if (!matchesSearch(vulnerability, searchQuery)) return false;
        if (
          severityFilter.length > 0 &&
          !severityFilter.includes(vulnerability.severity)
        ) {
          return false;
        }
        return CONTEXT_FACETS.every(([key, { matches }]) => {
          if (!contextFilter.includes(key as ContextFacet)) return true;
          return matches(vulnerability);
        });
      }),
    [visibleVulnerabilities, searchQuery, severityFilter, contextFilter],
  );

  const severityCounts = useMemo(() => {
    const counts = {} as Record<Severity, number>;
    visibleVulnerabilities.forEach(v => {
      counts[v.severity] = (counts[v.severity] ?? 0) + 1;
    });
    return counts;
  }, [visibleVulnerabilities]);

  const contextCounts = useMemo(() => {
    const counts = {} as Record<ContextFacet, number>;
    CONTEXT_FACETS.forEach(([key, { matches }]) => {
      counts[key as ContextFacet] =
        visibleVulnerabilities.filter(matches).length;
    });
    return counts;
  }, [visibleVulnerabilities]);

  const sortedVulnerabilities = useMemo(() => {
    return [...filteredVulnerabilities].sort((a, b) => {
      if (sortType === 'Prioritet') {
        const diff = compareByPriority(a, b);
        return sortOrder === 'desc' ? diff : -diff;
      }

      if (sortType === 'Komponenter') {
        const componentDiff = compareByAffectedComponents(a, b);
        if (componentDiff !== 0) {
          return sortOrder === 'desc' ? componentDiff : -componentDiff;
        }
        return compareBySeverity(a, b);
      }

      const severityDiff = compareBySeverity(a, b);
      if (severityDiff !== 0) {
        return sortOrder === 'desc' ? severityDiff : -severityDiff;
      }
      return compareByAffectedComponents(a, b);
    });
  }, [filteredVulnerabilities, sortOrder, sortType]);

  const pageCount = Math.max(
    1,
    Math.ceil(sortedVulnerabilities.length / rowsPerPage),
  );
  const safePage = Math.min(page, pageCount - 1);

  const paginatedVulnerabilities = useMemo(() => {
    const start = safePage * rowsPerPage;
    return sortedVulnerabilities.slice(start, start + rowsPerPage);
  }, [safePage, rowsPerPage, sortedVulnerabilities]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(0);
  };

  const toggleSeverity = (severity: Severity) => {
    setPage(0);
    setSeverityFilter(current =>
      current.includes(severity)
        ? current.filter(s => s !== severity)
        : [...current, severity],
    );
  };

  const toggleContext = (facet: ContextFacet) => {
    setPage(0);
    setContextFilter(current =>
      current.includes(facet)
        ? current.filter(f => f !== facet)
        : [...current, facet],
    );
  };

  const handleSortChange = (nextSortType: SortType) => {
    setPage(0);
    if (sortType === nextSortType) {
      setSortOrder(current => (current === 'desc' ? 'asc' : 'desc'));
      return;
    }
    setSortType(nextSortType);
    setSortOrder('desc');
  };

  const resultsText = `Viser ${sortedVulnerabilities.length} av ${
    visibleVulnerabilities.length
  }${showOpen ? ' åpne' : ''} sårbarheter`;

  return (
    <Stack gap={2}>
      <UniqueVulnerabilitiesFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        severityFilter={severityFilter}
        onToggleSeverity={toggleSeverity}
        severityCounts={severityCounts}
        contextFilter={contextFilter}
        onToggleContext={toggleContext}
        contextCounts={contextCounts}
        resultsText={resultsText}
        showOpen={showOpen}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1200, tableLayout: 'fixed' }} size="small">
          <TableHead>
            <TableRow>
              <TableCell width="160">
                <TableSortLabel
                  active={sortType === 'Alvorlighetsgrad'}
                  direction={
                    sortType === 'Alvorlighetsgrad' ? sortOrder : 'desc'
                  }
                  onClick={() => handleSortChange('Alvorlighetsgrad')}
                >
                  Alvorlighetsgrad
                </TableSortLabel>
              </TableCell>

              <TableCell width="30%">Beskrivelse</TableCell>

              <TableCell width="360">
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <TableSortLabel
                    active={sortType === 'Prioritet'}
                    direction={sortType === 'Prioritet' ? sortOrder : 'desc'}
                    onClick={() => handleSortChange('Prioritet')}
                  >
                    Kontekst
                  </TableSortLabel>
                  <Tooltip title={<ContextDescriptions />} placement="right">
                    <InfoOutlinedIcon
                      fontSize="inherit"
                      sx={{ opacity: 0.8, cursor: 'help' }}
                    />
                  </Tooltip>
                </Stack>
              </TableCell>

              <TableCell sx={{ width: 320 }}>
                <TableSortLabel
                  active={sortType === 'Komponenter'}
                  direction={sortType === 'Komponenter' ? sortOrder : 'desc'}
                  onClick={() => handleSortChange('Komponenter')}
                >
                  Komponenter
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedVulnerabilities.map(vulnerability => (
              <UniqueVulnerabilitiesTableRow
                key={vulnerability.vulnerabilityId}
                vulnerability={vulnerability}
              />
            ))}

            {paginatedVulnerabilities.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Box sx={{ py: 3 }}>
                    <Typography align="center" sx={{ opacity: 0.8 }}>
                      Ingen sårbarheter matcher søk eller filtre
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={4}
                count={sortedVulnerabilities.length}
                page={safePage}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={event => {
                  setRowsPerPage(Number(event.target.value));
                  setPage(0);
                }}
                rowsPerPageOptions={[10, 25, 50, 100]}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Stack>
  );
};

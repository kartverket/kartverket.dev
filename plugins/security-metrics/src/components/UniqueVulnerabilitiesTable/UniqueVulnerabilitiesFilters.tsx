import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import type { ContextFacet, Severity } from '../../typesFrontend';
import { SEVERITY_OPTIONS } from '../../typesFrontend';
import { getStandardSeverityFormat } from '../../utils/utils';
import { CONTEXT_FACETS } from '../shared/contextDescriptions';
import { ContextTag } from '../shared/ContextTag.tsx';
import { SeverityTag } from '../shared/SeverityTag.tsx';
import { ClusterTag } from '../shared/ClusterTag.tsx';

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  severityFilter: Severity[];
  onToggleSeverity: (severity: Severity) => void;
  severityCounts: Record<Severity, number>;
  contextFilter: ContextFacet[];
  onToggleContext: (facet: ContextFacet) => void;
  contextCounts: Record<ContextFacet, number>;
  clusterFilter: string[];
  onToggleCluster: (cluster: string) => void;
  clusterCounts: Record<string, number>;
  availableClusters: string[];
  resultsText: string;
  showOpen: boolean;
};

export const UniqueVulnerabilitiesFilters = ({
  searchQuery,
  onSearchChange,
  severityFilter,
  onToggleSeverity,
  severityCounts,
  contextFilter,
  onToggleContext,
  contextCounts,
  clusterFilter,
  onToggleCluster,
  clusterCounts,
  availableClusters,
  resultsText,
  showOpen,
}: Props) => {
  const noun = showOpen ? 'åpne sårbarheter' : 'sårbarheter';
  const contentRowSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    minHeight: 40,
  };
  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction={{ sm: 'column', lg: 'row' }}
        gap={4}
        alignItems={{ sm: 'stretch', lg: 'flex-start' }}
        flexWrap="wrap"
        mr={1}
      >
        <Box sx={{ flexGrow: 1, minWidth: 220 }}>
          <Typography
            variant="body2"
            sx={{ mb: 0.5, opacity: 0.7, fontWeight: 500 }}
          >
            Søk
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="CVE, beskrivelse, komponent..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ opacity: 0.8 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ flexShrink: 0 }}>
          <Typography
            variant="body2"
            sx={{ mb: 0.5, opacity: 0.7, fontWeight: 500 }}
          >
            Alvorlighetsgrad
          </Typography>
          <Box sx={contentRowSx}>
            {SEVERITY_OPTIONS.map(severity => {
              const count = severityCounts[severity] ?? 0;
              const disabled = count === 0;
              const selected = severityFilter.includes(severity);
              const label = getStandardSeverityFormat(severity);
              return (
                <SeverityTag
                  key={severity}
                  severity={severity}
                  onClick={() => onToggleSeverity(severity)}
                  selected={selected}
                  disabled={disabled}
                  tooltip={
                    disabled
                      ? `Ingen ${noun} har alvorlighetsgrad "${label}"`
                      : undefined
                  }
                />
              );
            })}
          </Box>
        </Box>

        <Box sx={{ flexShrink: 0 }}>
          <Typography
            variant="body2"
            sx={{ mb: 0.5, opacity: 0.7, fontWeight: 500 }}
          >
            Kontekst
          </Typography>
          <Box sx={contentRowSx}>
            {CONTEXT_FACETS.map(([key, { Icon, label, description }]) => {
              const count = contextCounts[key as ContextFacet] ?? 0;
              const disabled = count === 0;
              const selected = contextFilter.includes(key as ContextFacet);
              return (
                <ContextTag
                  key={key}
                  variant={key}
                  label={label}
                  Icon={Icon}
                  tooltip={
                    disabled ? `Ingen ${noun} matcher "${label}"` : description
                  }
                  onClick={() => onToggleContext(key as ContextFacet)}
                  selected={selected}
                  disabled={disabled}
                />
              );
            })}
          </Box>
        </Box>

        {availableClusters.length > 0 && (
          <Box sx={{ flexShrink: 0 }}>
            <Typography
              variant="body2"
              sx={{ mb: 0.5, opacity: 0.7, fontWeight: 500 }}
            >
              Miljø
            </Typography>
            <Box sx={contentRowSx}>
              {availableClusters.map(cluster => {
                const count = clusterCounts[cluster] ?? 0;
                const disabled = count === 0;
                return (
                  <ClusterTag
                    key={cluster}
                    cluster={cluster}
                    selected={clusterFilter.includes(cluster)}
                    disabled={disabled}
                    onClick={() => onToggleCluster(cluster)}
                    tooltip={
                      disabled
                        ? `Ingen ${noun} kjører i ${cluster}`
                        : `Vis bare sårbarheter som kjører i ${cluster}`
                    }
                  />
                );
              })}
            </Box>
          </Box>
        )}
      </Stack>

      <Typography variant="body2" sx={{ mt: 1.5, opacity: 0.7 }}>
        {resultsText}
      </Typography>
    </Paper>
  );
};

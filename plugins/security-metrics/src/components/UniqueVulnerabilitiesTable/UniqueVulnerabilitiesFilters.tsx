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
import { ContextTag } from './ContextTag.tsx';
import { SeverityTag } from '../shared/SeverityTag.tsx';
import { ClusterTag } from './ClusterTag.tsx';

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

type FilterSectionProps = {
  heading: string;
  children: React.ReactNode;
  sx?: React.ComponentProps<typeof Box>['sx'];
};

const FilterSection = ({ heading, children, sx }: FilterSectionProps) => (
  <Box sx={{ flexShrink: 0, ...sx }}>
    <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.7, fontWeight: 500 }}>
      {heading}
    </Typography>
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minHeight: 40 }}
    >
      {children}
    </Box>
  </Box>
);

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
  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction={{ sm: 'column', lg: 'row' }}
        gap={4}
        alignItems={{ sm: 'stretch', lg: 'flex-start' }}
        flexWrap="wrap"
        mr={1}
      >
        <FilterSection heading="Søk" sx={{ flexGrow: 1, minWidth: 220 }}>
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
        </FilterSection>

        <FilterSection heading="Alvorlighetsgrad">
          {SEVERITY_OPTIONS.map(severity => {
            const count = severityCounts[severity] ?? 0;
            const disabled = count === 0;
            const label = getStandardSeverityFormat(severity);
            return (
              <SeverityTag
                key={severity}
                severity={severity}
                onClick={() => onToggleSeverity(severity)}
                selected={severityFilter.includes(severity)}
                disabled={disabled}
                tooltip={
                  disabled
                    ? `Ingen ${noun} har alvorlighetsgrad "${label}"`
                    : undefined
                }
              />
            );
          })}
        </FilterSection>

        <FilterSection heading="Kontekst">
          {CONTEXT_FACETS.map(([key, { Icon, label, description }]) => {
            const count = contextCounts[key as ContextFacet] ?? 0;
            const disabled = count === 0;
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
                selected={contextFilter.includes(key as ContextFacet)}
                disabled={disabled}
              />
            );
          })}
        </FilterSection>

        {availableClusters.length > 0 && (
          <FilterSection heading="Miljø">
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
                      : `Vis sårbarheter som kjører i ${cluster} (inkl. ukjent miljø)`
                  }
                />
              );
            })}
          </FilterSection>
        )}
      </Stack>

      <Typography variant="body2" sx={{ mt: 1.5, opacity: 0.7 }}>
        {resultsText}
      </Typography>
    </Paper>
  );
};

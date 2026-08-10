import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import type { ContextFacet, Severity } from '../../typesFrontend';
import { SEVERITY_OPTIONS } from '../../typesFrontend';
import { getStandardSeverityFormat } from '../../utils/utils';
import { CONTEXT_FACETS } from '../shared/contextDescriptions';
import { ContextTag } from '../shared/ContextTag.tsx';
import { SeverityTag } from '../shared/SeverityTag.tsx';

export const DEFAULT_SEVERITY_FILTER: Severity[] = ['critical', 'high'];

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  severityFilter: Severity[];
  onToggleSeverity: (severity: Severity) => void;
  severityCounts: Record<Severity, number>;
  contextFilter: ContextFacet[];
  onToggleContext: (facet: ContextFacet) => void;
  contextCounts: Record<ContextFacet, number>;
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
  resultsText,
  showOpen,
}: Props) => {
  const noun = showOpen ? 'åpne sårbarheter' : 'sårbarheter';
  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction={{ sm: 'column', md: 'row' }}
        gap={2}
        alignItems={{ sm: 'stretch', md: 'center' }}
      >
        <TextField
          size="small"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Søk etter CVE, beskrivelse, komponent..."
          sx={{ flexGrow: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ opacity: 0.7 }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Typography variant="body2" sx={{ opacity: 0.6 }}>
          Velg filter her:
        </Typography>

        <Stack
          direction="row"
          gap={0.5}
          flexWrap="wrap"
          alignItems="center"
          flexShrink={0}
        >
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
        </Stack>

        <Stack
          direction="row"
          gap={0.5}
          flexWrap="wrap"
          alignItems="center"
          flexShrink={0}
        >
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
        </Stack>
      </Stack>

      <Typography variant="body2" sx={{ mt: 1.5, opacity: 0.6 }}>
        {resultsText}
      </Typography>
    </Paper>
  );
};

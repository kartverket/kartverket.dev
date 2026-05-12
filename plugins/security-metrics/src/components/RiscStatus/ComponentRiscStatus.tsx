import { CardTitle } from '../CardTitle';
import { CheckCircleOutlined, HighlightOffOutlined } from '@mui/icons-material';
import { calculateDaysSince, plural } from './utils';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { RiscStatusData } from '../../typesFrontend';
import Divider from '@mui/material/Divider';

type ComponentRiscStatusProps = {
  riscStatus: RiscStatusData;
};

const MetricLine = ({ label, value }: { label: string; value: string }) => (
  <Box
    display="flex"
    alignItems="baseline"
    justifyContent="space-between"
    gap={2}
  >
    <Typography variant="body2">{label}</Typography>
    <Typography variant="body2" fontWeight={500} textAlign="right">
      {value}
    </Typography>
  </Box>
);

export const ComponentRiscStatus = ({
  riscStatus,
}: ComponentRiscStatusProps) => {
  if (!riscStatus)
    return (
      <CardTitle title="Risiko- og sårbarhetsarbeid">
        <Stack px={2} pb={2}>
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            Vi fant dessverre ingen status på RoS-arbeid.
          </Typography>
        </Stack>
      </CardTitle>
    );

  const days = calculateDaysSince(riscStatus.lastPublishedRisc);
  const commits = riscStatus.commitsSincePublishedRisc;

  return (
    <CardTitle title="Risiko- og sårbarhetsarbeid">
      <Stack mt={1} px={2} pb={2} gap={1.5}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body2">Operasjonell RoS</Typography>

          {riscStatus.hasRisc ? (
            <Tooltip title="Konfigurert">
              <CheckCircleOutlined color="success" />
            </Tooltip>
          ) : (
            <Tooltip title="Ikke konfigurert">
              <HighlightOffOutlined color="error" />
            </Tooltip>
          )}
        </Box>

        <Divider />

        {riscStatus.hasRisc && (
          <Stack gap={1.5}>
            {days !== null && (
              <MetricLine
                label="Sist publisert"
                value={`${days} ${plural(days, 'dag', 'dager')} siden`}
              />
            )}

            <Divider />

            {commits !== null && (
              <MetricLine
                label="Endringer i repoet etter forrige publisering"
                value={`${commits} ${plural(commits, 'commit', 'commits')}`}
              />
            )}
          </Stack>
        )}
      </Stack>
    </CardTitle>
  );
};

import { CardTitle } from '../shared/CardTitle';
import { CheckCircleOutlined, HighlightOffOutlined } from '@mui/icons-material';
import { calculateDaysSince, plural } from './utils';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { RiscStatusData } from '../../typesFrontend';
import Divider from '@mui/material/Divider';
import { StatusRow } from '../shared/StatusRow';

type ComponentRiscStatusProps = {
  riscStatus: RiscStatusData;
};

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
      <Stack mt={1} pb={1} divider={<Divider />} sx={{ flex: 1 }}>
        <StatusRow>
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
        </StatusRow>

        {riscStatus.hasRisc && days !== null && (
          <StatusRow>
            <Typography variant="body2">Sist publisert</Typography>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ textAlign: 'right' }}
            >
              {days} {plural(days, 'dag', 'dager')} siden
            </Typography>
          </StatusRow>
        )}

        {riscStatus.hasRisc && commits !== null && (
          <StatusRow>
            <Typography variant="body2">
              Endringer etter forrige publisering
            </Typography>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ textAlign: 'right' }}
            >
              {commits} {plural(commits, 'commit', 'commits')}
            </Typography>
          </StatusRow>
        )}
      </Stack>
    </CardTitle>
  );
};

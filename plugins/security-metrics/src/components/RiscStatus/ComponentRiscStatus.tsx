import { CardTitle } from '../shared/CardTitle';
import { Check, Close } from '@mui/icons-material';
import { calculateDaysSince, plural } from './utils';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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
      <CardTitle title="Operasjonell RoS">
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
    <CardTitle title="Operasjonell RoS">
      <Stack mt={1} pb={1} divider={<Divider />} sx={{ flex: 1 }}>
        <StatusRow>
          <Typography variant="body2">Har operasjonell RoS</Typography>
          {riscStatus.hasRisc ? (
            <Check color="success" />
          ) : (
            <Close color="error" />
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

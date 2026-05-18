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
        <Box
          sx={{
            flex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            textAlign: 'left',
          }}
        >
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

        {riscStatus.hasRisc && days !== null && (
          <Box
            sx={{
              flex: 1,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              textAlign: 'left',
            }}
          >
            <Typography variant="body2">Sist publisert</Typography>
            <Typography variant="body2" fontWeight={500}>
              {days} {plural(days, 'dag', 'dager')} siden
            </Typography>
          </Box>
        )}

        {riscStatus.hasRisc && commits !== null && (
          <Box
            sx={{
              flex: 1,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              textAlign: 'left',
            }}
          >
            <Typography variant="body2">
              Endringer etter forrige publisering
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {commits} {plural(commits, 'commit', 'commits')}
            </Typography>
          </Box>
        )}
      </Stack>
    </CardTitle>
  );
};

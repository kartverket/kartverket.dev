import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';
import type { Scanner } from '../../typesFrontend';

const scannerTooltips: Record<string, string> = {
  Dependabot:
    'Scanner kodeavhengigheter for kjente sårbarheter. Bør være aktivert på alle repoer som ikke er av typen documentation.',
  CodeQL: 'Analyserer selve kildekoden for konfigurasjonsfeil.',
  Pharos:
    'Scanner docker images og infrastruktur for sårbarheter. Krever at repoet bygger en container.',
  Sysdig:
    'Scanner tjenester som kjører på SKIP for sårbarheter. Ikke relevant dersom man ikke kan/skal kjøre på SKIP.',
};

type Props = {
  name: Scanner;
};

export const ScannerInfo = ({ name }: Props) => (
  <Stack direction="row" alignItems="center" spacing={0.75}>
    <Tooltip title={scannerTooltips[name]}>
      <InfoIcon fontSize="small" sx={{ color: 'text.secondary' }} />
    </Tooltip>
    <Typography>{name}</Typography>
  </Stack>
);

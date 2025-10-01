import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { RepositorySummary } from '../../typesFrontend';
import { getScannersGroupedByStatus } from './utils';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  repository: RepositorySummary;
};

export const RepositoryScannerStatus = ({ repository }: Props) => {
  const theme = useTheme();
  const { configured, notConfigured } = getScannersGroupedByStatus(repository);
  const noScannerConfigured = configured.length === 0;

  return (
    <Stack gap={0.5}>
      {configured.length === 4 ? (
        <Typography
          variant="body2"
          display="flex"
          alignItems="center"
          gap={0.5}
        >
          <CheckIcon color="success" />
          Alle scannere aktivert
        </Typography>
      ) : (
        <Typography
          variant="body2"
          color={theme.palette.text.secondary}
          display="flex"
          alignItems="center"
          gap={0.5}
        >
          <CloseIcon color={noScannerConfigured ? 'error' : 'disabled'} />
          {noScannerConfigured
            ? 'Ingen aktiverte scannere'
            : notConfigured.join(', ')}
        </Typography>
      )}
    </Stack>
  );
};

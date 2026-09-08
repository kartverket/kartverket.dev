import Stack from '@mui/material/Stack';
import { Box } from '@mui/system';
import { MetricsStatus } from './MetricsStatus';
import { Secrets, SecretsAlert } from '../SecretsOverview/SecretsAlert';
import NoAccessAlert from './NoAccessAlert';
import { ViewSettingsButton } from './ViewSettingsButton';
import { FilterEnum } from '../../typesFrontend';
import Alert from '@mui/material/Alert';
import { Error } from '@mui/icons-material';
import AlertTitle from '@mui/material/AlertTitle';
import Link from '@mui/material/Link';

interface StarFilterProps {
  hasStarred: boolean;
  effectiveFilter: FilterEnum;
  onToggleStarFilter: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
}

interface ViewSettingsProps {
  showTotal: boolean;
  showOpen: boolean;
  onToggleShowTotal: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
  onToggleShowOpen: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
  starFilter?: StarFilterProps;
}

interface Props {
  entityName: string;
  secrets: Secrets[];
  notPermitted?: string[];
  viewSettingsProps: ViewSettingsProps;
  rightActions?: React.ReactNode;
}

export const PageHeader = ({
  entityName,
  secrets,
  notPermitted,
  viewSettingsProps,
  rightActions,
}: Props) => {
  return (
    <>
      <Stack flexDirection="row" alignItems="center" flexWrap="wrap" gap={2}>
        <MetricsStatus entityName={entityName} />
        <Stack
          flexDirection="row"
          gap={2}
          flex={1}
          flexWrap="wrap"
          sx={{ '& > *': { flex: 1 } }}
        >
          <SecretsAlert secretsOverviewData={secrets} />
        </Stack>
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={0.5}>
          <ViewSettingsButton {...viewSettingsProps} />
          {rightActions}
        </Box>
      </Stack>
      {notPermitted && notPermitted.length > 0 && (
        <NoAccessAlert repos={notPermitted} />
      )}
      <Alert severity="error" icon={<Error />}>
        <AlertTitle fontSize={50}>
          Tjenesten for å samle inn sårbarheter er for tiden utilgjengelig.
        </AlertTitle>
        <AlertTitle fontSize={25} paddingTop={2}>
          Sikkerhetsmetrikker vil derfor <strong>ikke</strong> gi et riktig
          oversiktsbilde over sårbarheter. Vi jobber med saken. I mellomtiden er
          dere nødt til å benytte GitHub Security og{' '}
          <Link href="https://eu1.app.sysdig.com/">sysdig</Link>
        </AlertTitle>
      </Alert>
    </>
  );
};

import Stack from '@mui/material/Stack';
import { Box } from '@mui/system';
import { MetricsStatus } from './MetricsStatus';
import { Secrets, SecretsAlert } from '../SecretsOverview/SecretsAlert';
import { ViewSettingsButton } from './ViewSettingsButton';
import { FilterEnum } from '../../typesFrontend';
import { NoAccessAlert } from './NoAccessAlert';

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
        {notPermitted && notPermitted.length > 0 && (
          <NoAccessAlert repos={notPermitted} />
        )}
      </Stack>
      <Box display="flex" alignItems="center" flexWrap="wrap" gap={0.5}>
        <ViewSettingsButton {...viewSettingsProps} />
        {rightActions}
      </Box>
    </Stack>
  );
};

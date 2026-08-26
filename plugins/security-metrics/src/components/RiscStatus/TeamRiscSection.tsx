import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RiscStatusData } from '../../typesFrontend';
import { useGroupInfo } from '../../hooks/useUserInfo';
import { RiscStatusTable } from './RiscStatusTable';

export const UNKNOWN_TEAM = '__unknown__';

type Props = {
  owner: string;
  statuses: RiscStatusData[];
};

export const TeamRiscSection = ({ owner, statuses }: Props) => {
  const isUnknown = owner === UNKNOWN_TEAM;
  const { data: group, isLoading } = useGroupInfo(isUnknown ? '' : owner);

  let displayName: string;
  if (isUnknown) {
    displayName = 'Ukjent team';
  } else {
    const rawName = group?.metadata?.name ?? owner;
    displayName = `Team ${rawName.charAt(0).toUpperCase() + rawName.slice(1)}`;
  }

  return (
    <Stack gap={1}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {!isUnknown && isLoading ? (
          <Skeleton variant="text" width={160} height={24} />
        ) : (
          <Typography variant="subtitle1" fontWeight={600}>
            {displayName}
          </Typography>
        )}
      </Stack>
      <RiscStatusTable statuses={statuses} />
    </Stack>
  );
};

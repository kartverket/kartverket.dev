import Box from '@mui/material/Box';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { RiscStatusData } from '../../typesFrontend';
import { CardTitle } from '../shared/CardTitle';
import { RiscStatusDialog } from './RiscStatusDialog';
import { calculateDaysSince } from './utils';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { StatusRow } from '../shared/StatusRow';

interface SystemRiscStatusesProps {
  data: RiscStatusData[];
}

type RiscCategory = 'mangler' | 'utdatert' | 'oppdatert';

type CategoryConfig = {
  key: RiscCategory;
  label: string;
  Icon: React.ComponentType<SvgIconProps>;
  color: SvgIconProps['color'];
};

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'mangler',
    label: 'Mangler RoS',
    Icon: CloseIcon,
    color: 'error',
  },
  {
    key: 'utdatert',
    label: 'Utdatert RoS',
    Icon: CheckIcon,
    color: 'warning',
  },
  {
    key: 'oppdatert',
    label: 'Oppdatert RoS',
    Icon: CheckIcon,
    color: 'success',
  },
];

const categorise = (risc: RiscStatusData): RiscCategory => {
  if (!risc.hasRisc) return 'mangler';
  if (!risc.lastPublishedRisc) return 'mangler';
  const days = calculateDaysSince(risc.lastPublishedRisc) ?? 0;
  return days > 365 ? 'utdatert' : 'oppdatert';
};

export const SystemRiscStatuses = ({ data }: SystemRiscStatusesProps) => {
  const [openDialogFor, setOpenDialogFor] = useState<RiscCategory | null>(null);

  if (!data || data.length === 0) {
    return (
      <CardTitle title="Operasjonell RoS">
        <Box px={2} pb={2}>
          <Typography data-testid="noData">
            <i>Vi fant dessverre ingen status på RoS-arbeid.</i>
          </Typography>
        </Box>
      </CardTitle>
    );
  }

  const byCategory = Object.fromEntries(
    CATEGORIES.map(c => [c.key, data.filter(r => categorise(r) === c.key)]),
  ) as Record<RiscCategory, RiscStatusData[]>;

  return (
    <CardTitle title="Operasjonell RoS">
      <Stack mt={1} pb={1} divider={<Divider />} sx={{ flex: 1 }}>
        {CATEGORIES.map(({ key, label, Icon, color }) => {
          const statuses = byCategory[key];
          return (
            <Box
              key={key}
              sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              <StatusRow onClick={() => setOpenDialogFor(key)}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Icon color={color} fontSize="small" />
                  <Typography variant="body2">{label}</Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  flexShrink={0}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {statuses.length}
                  </Typography>
                  <ChevronRightIcon
                    fontSize="small"
                    sx={{ color: 'text.secondary' }}
                  />
                </Box>
              </StatusRow>
              <RiscStatusDialog
                categoryLabel={label}
                riscStatuses={statuses}
                isDialogOpen={openDialogFor === key}
                setIsDialogOpen={open => setOpenDialogFor(open ? key : null)}
              />
            </Box>
          );
        })}
      </Stack>
    </CardTitle>
  );
};

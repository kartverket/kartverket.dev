import Box from '@mui/material/Box';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ReactNode, useState } from 'react';
import { RiscStatusData } from '../../typesFrontend';
import { CardTitle } from '../shared/CardTitle';
import { StatusRow } from '../shared/StatusRow';
import { CATEGORIES, RiscCategory, categorise } from './categories';

type RenderDialogArgs = {
  category: RiscCategory;
  label: string;
  statuses: RiscStatusData[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

type Props = {
  data: RiscStatusData[];
  renderDialog: (args: RenderDialogArgs) => ReactNode;
};

export const RiscStatusCardBase = ({ data, renderDialog }: Props) => {
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
              {renderDialog({
                category: key,
                label,
                statuses,
                isOpen: openDialogFor === key,
                setOpen: open => setOpenDialogFor(open ? key : null),
              })}
            </Box>
          );
        })}
      </Stack>
    </CardTitle>
  );
};

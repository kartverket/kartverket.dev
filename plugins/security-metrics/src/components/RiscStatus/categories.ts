import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { RiscStatusData } from '../../typesFrontend';
import { calculateDaysSince } from './utils';

export type RiscCategory = 'mangler' | 'utdatert' | 'oppdatert';

export type CategoryConfig = {
  key: RiscCategory;
  label: string;
  Icon: React.ComponentType<SvgIconProps>;
  color: SvgIconProps['color'];
};

export const CATEGORIES: CategoryConfig[] = [
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

export const categorise = (risc: RiscStatusData): RiscCategory => {
  if (!risc.hasRisc) return 'mangler';
  if (!risc.lastPublishedRisc) return 'mangler';
  const days = calculateDaysSince(risc.lastPublishedRisc) ?? 0;
  return days > 365 ? 'utdatert' : 'oppdatert';
};

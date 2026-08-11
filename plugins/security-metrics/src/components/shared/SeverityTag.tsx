import { Severity } from '../../typesFrontend.ts';
import {
  getStandardSeverityFormat,
  SeverityColors,
} from '../../utils/utils.ts';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { BASIC_COLORS } from '../../colors.ts';

type Props = {
  severity: Severity;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  tooltip?: string;
};

export const SeverityTag = ({
  severity,
  onClick,
  selected = true,
  disabled = false,
  tooltip,
}: Props) => {
  const color = SeverityColors[severity];
  const textOnColor =
    severity === 'low' || severity === 'negligible' ? 'grey.900' : 'white';

  return (
    <Tooltip title={tooltip}>
      <span>
        <Chip
          label={getStandardSeverityFormat(severity)}
          onClick={onClick}
          disabled={disabled}
          slotProps={{
            label: {
              sx: {
                fontSize: '0.8rem',
              },
            },
          }}
          sx={{
            color: selected ? textOnColor : BASIC_COLORS.GREY,
            backgroundColor: selected ? color : 'transparent',
            border: selected
              ? '1px solid transparent'
              : `1px solid ${BASIC_COLORS.GREY}`,
            m: 0,
            cursor: onClick && !disabled ? 'pointer' : 'default',
            '&:hover': { backgroundColor: selected ? color : 'transparent' },
          }}
        />
      </span>
    </Tooltip>
  );
};

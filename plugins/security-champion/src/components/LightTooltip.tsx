import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

export const CustomTooltip = (props: TooltipProps) => (
  <Tooltip
    {...props}
    slotProps={{
      ...props.slotProps,
      tooltip: {
        ...props.slotProps?.tooltip,
        sx: {
          backgroundColor: 'var(--bui-bg-app)',
          fontSize: 16,
          maxWidth: 750,
          padding: 1,
          wordWrap: 'break-word',
          border: '1px solid var(--bui-border-1)',
        },
      },
    }}
  />
);

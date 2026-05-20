import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

const sharedSx = {
  flex: 1,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: 2,
  gap: 1,
  textAlign: 'left' as const,
};

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
}

export const StatusRow = ({ children, onClick }: Props) => {
  if (onClick) {
    return (
      <ButtonBase
        onClick={onClick}
        sx={{ ...sharedSx, '&:hover': { bgcolor: 'action.hover' } }}
      >
        {children}
      </ButtonBase>
    );
  }

  return <Box sx={sharedSx}>{children}</Box>;
};

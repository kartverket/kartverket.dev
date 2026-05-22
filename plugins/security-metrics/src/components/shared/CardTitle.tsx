import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

type CardTitleProps = {
  title: React.ReactNode;
  children?: ReactNode;
  marginBottom?: boolean;
};

export const CardTitle = ({
  title,
  children,
  marginBottom,
}: CardTitleProps) => {
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Typography
        fontWeight="bold"
        variant="h6"
        m={2}
        mb={marginBottom ? 2 : 0}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

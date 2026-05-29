import Typography from '@mui/material/Typography';
import { StyledTableRow } from '../shared/StyledTableRow';
import TableCell from '@mui/material/TableCell';
import Alert from '@mui/material/Alert';

type Props = {
  name: string;
  message?: string;
  colSpan?: number;
};

export const NoAccessRow = ({
  name,
  message = 'Du har ikke tilgang til metrikker for denne komponenten',
  colSpan = 5,
}: Props) => {
  return (
    <StyledTableRow key={name}>
      <TableCell>
        <Typography>{name}</Typography>
      </TableCell>
      <TableCell colSpan={colSpan}>
        <Alert severity="warning">{message}</Alert>
      </TableCell>
    </StyledTableRow>
  );
};

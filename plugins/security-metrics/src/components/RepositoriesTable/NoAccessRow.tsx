import Typography from '@mui/material/Typography';
import { StyledTableRow } from '../TableRow';
import TableCell from '@mui/material/TableCell';
import Alert from '@mui/material/Alert';

type Props = {
  repositoryName: string;
};

export const NoAccessRow = ({ repositoryName }: Props) => {
  return (
    <StyledTableRow key={repositoryName}>
      <TableCell>
        <Typography>{repositoryName}</Typography>
      </TableCell>
      <TableCell colSpan={5}>
        <Alert severity="warning">
          Du har ikke tilgang til metrikker for denne komponenten
        </Alert>
      </TableCell>
    </StyledTableRow>
  );
};

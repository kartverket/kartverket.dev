import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import { styled } from '@mui/system';

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`&.${tableRowClasses.root}`]: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
}));

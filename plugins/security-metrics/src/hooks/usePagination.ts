import { TablePaginationProps } from '@mui/material/TablePagination';
// eslint-disable-next-line no-restricted-imports
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import { ChangeEvent, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';

/**
 * Hook for handling pagination props for a MUI TablePagination component.
 * @param count The total number of items to paginate
 * @param initialPage The initial page to start on
 * @param initialRowsPerPage The number of rows per page to start with
 * @param rowsPerPageOptions The options for the rows per page select
 */
export const usePaginationProps = (
  count: number,
  initialPage: number = 0,
  initialRowsPerPage: number = 10,
  rowsPerPageOptions: number[] = [5, 10, 25, 50],
): TablePaginationProps => {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const onPageChange = (
    _event: ReactMouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const onRowsPerPageChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slotProps = {
    select: {
      inputProps: {
        'aria-label': 'Rader per side',
      },
      native: true,
    },
  };
  return {
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions: rowsPerPageOptions,
    ActionsComponent: TablePaginationActions,
    slotProps: slotProps,
  };
};

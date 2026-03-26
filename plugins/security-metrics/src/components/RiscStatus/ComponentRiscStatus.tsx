import { CardTitle } from '../CardTitle';
import { CheckCircleOutlined, HighlightOffOutlined } from '@mui/icons-material';
import { StyledTableRow } from '../TableRow';
import { calculateDaysSince, plural } from './utils';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import { RiscStatusData } from '../../typesFrontend';
import { Fragment } from 'react/jsx-runtime';

type ComponentRiscStatusProps = {
  riscStatus: RiscStatusData;
};

export const ComponentRiscStatus = ({
  riscStatus,
}: ComponentRiscStatusProps) => {
  if (!riscStatus)
    return (
      <CardTitle title="Risiko- og sårbarhetsarbeid">
        <Stack px={2}>
          <Typography>
            <i>Vi fant dessverre ingen status på RoS-arbeid.</i>
          </Typography>
        </Stack>
      </CardTitle>
    );

  const days = calculateDaysSince(riscStatus.lastPublishedRisc);
  const commits = riscStatus.commitsSincePublishedRisc;

  return (
    <CardTitle title="Risiko- og sårbarhetsarbeid">
      <Stack px={2}>
        <Table size="small">
          <TableBody>
            <Fragment key={riscStatus.repositoryName}>
              <StyledTableRow>
                <TableCell>Kodenær ROS</TableCell>
                <TableCell>
                  {riscStatus.hasRisc ? (
                    <Tooltip title="Konfigurert">
                      <CheckCircleOutlined color="success" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Ikke konfigurert">
                      <HighlightOffOutlined color="error" />
                    </Tooltip>
                  )}
                </TableCell>
              </StyledTableRow>

              {riscStatus.hasRisc && days !== null && (
                <StyledTableRow>
                  <TableCell>Dager siden forrige publiserte RoS</TableCell>
                  <TableCell>
                    <Typography>
                      {days} {plural(days, 'dag', 'dager')}
                    </Typography>
                  </TableCell>
                </StyledTableRow>
              )}

              {riscStatus.hasRisc && commits !== null && (
                <StyledTableRow>
                  <TableCell>
                    Antall commits siden forrige publiserte RoS
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {commits} {plural(commits, 'commit', 'commits')}
                    </Typography>
                  </TableCell>
                </StyledTableRow>
              )}
            </Fragment>
          </TableBody>
        </Table>
      </Stack>
    </CardTitle>
  );
};

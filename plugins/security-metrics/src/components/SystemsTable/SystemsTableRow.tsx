import Typography from '@mui/material/Typography';
import { Box, Stack } from '@mui/system';
import type { SeverityCount } from '../../typesFrontend';
import { StyledTableRow } from '../TableRow';
import { VulnerabilityDistribution } from '../VulnerabilityDistribution';
import { useNavigate } from 'react-router-dom';
import TableCell from '@mui/material/TableCell';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { NoAccessRow } from '../RepositoriesTable/NoAccessRow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useState } from 'react';

type Props = {
  systemName: string;
  notPermittedCount: number;
  severityCount?: SeverityCount;
  highestVulnerabilityCount?: number;
  noSystemComponents?: string[];
};

export const SystemsTableRow = ({
  systemName,
  notPermittedCount,
  severityCount,
  highestVulnerabilityCount,
  noSystemComponents = [],
}: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const noSystem = noSystemComponents.length > 0;

  if (!severityCount || !highestVulnerabilityCount) {
    return <NoAccessRow key={systemName} repositoryName={systemName} />;
  }

  const { critical, high, medium, low, negligible, unknown } = severityCount;
  const total = critical + high + medium + low + negligible + unknown;

  const handleRowClick = () => {
    if (noSystem) {
      setOpen(o => !o);
    } else {
      navigate(`/catalog/default/system/${systemName}/securityMetrics`);
    }
  };

  return (
    <>
      <StyledTableRow
        key={systemName}
        hover
        sx={{ cursor: 'pointer' }}
        onClick={handleRowClick}
      >
        <TableCell>
          <Typography>{systemName}</Typography>
          {noSystem && (
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {noSystemComponents.length}{' '}
              {` komponent${noSystemComponents.length > 1 ? 'er' : ''}`}
            </Typography>
          )}
        </TableCell>

        <TableCell>
          {total > 0 ? (
            <Stack direction="row" maxWidth="500px" gap={2} alignItems="center">
              <Typography width={50}>{total}</Typography>
              <Box width="100%">
                <VulnerabilityDistribution
                  severityCount={severityCount}
                  highestVulnerabilityCount={highestVulnerabilityCount}
                />
              </Box>
            </Stack>
          ) : (
            <Typography>Ingen sårbarheter</Typography>
          )}
        </TableCell>

        <TableCell>
          {notPermittedCount > 0 && (
            <TableCell>
              <Alert severity="warning">
                Du mangler tilgang til {notPermittedCount}{' '}
                {` komponent${notPermittedCount > 1 ? 'er' : ''}`}
              </Alert>
            </TableCell>
          )}
        </TableCell>

        <TableCell>
          {noSystem ? (
            <>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</>
          ) : (
            <ArrowForwardIosIcon fontSize="small" />
          )}
        </TableCell>
      </StyledTableRow>

      {noSystem && (
        <TableRow>
          <TableCell colSpan={4} sx={{ p: 0 }}>
            <Collapse in={open}>
              <Box sx={{ m: 1 }}>
                <Table size="small" sx={{ width: '100%' }}>
                  <TableBody>
                    {noSystemComponents.map(component => (
                      <TableRow
                        key={component}
                        hover
                        sx={{
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          navigate(
                            `/catalog/default/component/${component}/securityMetrics`,
                          )
                        }
                      >
                        <TableCell>
                          <Typography>{component}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <ArrowForwardIosIcon fontSize="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

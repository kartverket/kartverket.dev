import Typography from '@mui/material/Typography';
import { Box, Stack } from '@mui/system';
import type { RepositorySummary } from '../../typesFrontend';
import { StyledTableRow } from '../TableRow';
import { RepositoryScannerStatus } from './RepositoryScannerStatus';
import { VulnerabilityDistribution } from '../VulnerabilityDistribution';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useState } from 'react';
import { riscStatusLabel } from '../RiscStatus/RiscStatusLabel';

type Props = {
  repository: RepositorySummary;
  highestVulnerabilityCount: number;
};

export const RepositoriesTableRow = ({
  repository,
  highestVulnerabilityCount,
}: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const severityCount = repository.severityCount;
  const { critical, high, medium, low, negligible, unknown } = severityCount;
  const total = critical + high + medium + low + negligible + unknown;

  const mttr = repository.averageTimeToSolveVulnerabilityDays;
  const componentNames = repository.componentNames;
  const isShared = componentNames.length > 1;

  const handleRowClick = () => {
    if (isShared) {
      setOpen(o => !o);
    } else {
      navigate(
        `/catalog/default/component/${componentNames[0]}/securityMetrics`,
      );
    }
  };

  return (
    <>
      <StyledTableRow
        key={repository.repoName}
        hover
        sx={{ cursor: 'pointer' }}
        onClick={handleRowClick}
      >
        <TableCell>
          <Typography>
            {isShared ? repository.repoName : componentNames[0]}
          </Typography>
          {isShared && (
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {componentNames.length} komponenter
            </Typography>
          )}
        </TableCell>
        <TableCell>
          <Box display="flex" alignItems="center" minHeight="32px">
            <Box display="flex" gap={1}>
              {repository.riscStatus?.hasRisc ? (
                <Tooltip title="Har en kodenær ROS">
                  <CheckIcon color="success" />
                </Tooltip>
              ) : (
                <Tooltip title="Har ikke en kodenær ROS">
                  <CloseIcon color="error" />
                </Tooltip>
              )}
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Box display="flex" alignItems="center" minHeight="32px">
            <Box display="flex" gap={1}>
              {repository.riscStatus?.hasRisc &&
                riscStatusLabel(repository.riscStatus)}
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          {typeof mttr === 'number' ? (
            <Typography>{Math.round(mttr)} dager</Typography>
          ) : (
            <Typography>
              <i>Ingen data</i>
            </Typography>
          )}
        </TableCell>
        <TableCell>
          <RepositoryScannerStatus repository={repository} />
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
          {isShared ? (
            <>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</>
          ) : (
            <ArrowForwardIosIcon fontSize="small" />
          )}
        </TableCell>
      </StyledTableRow>

      {isShared && (
        <TableRow>
          <TableCell colSpan={7} sx={{ p: 0 }}>
            <Collapse in={open}>
              <Box sx={{ m: 1 }}>
                <Table size="small" sx={{ width: '100%' }}>
                  <TableBody>
                    {componentNames.map(name => (
                      <TableRow
                        key={name}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={e => {
                          e.stopPropagation();
                          navigate(
                            `/catalog/default/component/${name}/securityMetrics`,
                          );
                        }}
                      >
                        <TableCell>
                          <Typography>{name}</Typography>
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

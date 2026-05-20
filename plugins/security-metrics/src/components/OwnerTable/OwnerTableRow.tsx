import Typography from '@mui/material/Typography';
import { Box, Stack } from '@mui/system';
import type { SeverityCount } from '../../typesFrontend';
import { StyledTableRow } from '../TableRow';
import { VulnerabilityDistribution } from '../VulnerabilityDistribution';
import { useNavigate } from 'react-router-dom';
import TableCell from '@mui/material/TableCell';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useGroupInfo } from '../../hooks/useUserInfo';

type Props = {
  teamId: string;
  severityCount: SeverityCount;
  highestVulnerabilityCount: number;
  onNavigate: () => void;
};

export const OwnerTableRow = ({
  teamId,
  severityCount,
  highestVulnerabilityCount,
  onNavigate,
}: Props) => {
  const navigate = useNavigate();

  const { data: team } = useGroupInfo(teamId);

  const { critical, high, medium, low, negligible, unknown } = severityCount;
  const total = critical + high + medium + low + negligible + unknown;

  return (
    <>
      <StyledTableRow
        key={teamId}
        hover
        sx={{ cursor: 'pointer' }}
        onClick={() => {
          navigate(
            `/catalog/default/group/${team?.metadata?.name}/securityMetrics`,
          );
          onNavigate();
        }}
      >
        <TableCell>
          <Typography>{team?.metadata?.name || teamId}</Typography>
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

        <TableCell align="right">
          <ArrowForwardIosIcon fontSize="small" />
        </TableCell>
      </StyledTableRow>
    </>
  );
};

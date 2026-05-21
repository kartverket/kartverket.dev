import Typography from '@mui/material/Typography';
import { Box, Stack } from '@mui/system';
import type { SeverityCount } from '../../typesFrontend';
import { StyledTableRow } from '../TableRow';
import { VulnerabilityDistribution } from '../VulnerabilityDistribution';
import { useNavigate } from 'react-router-dom';
import TableCell from '@mui/material/TableCell';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useGroupInfo } from '../../hooks/useUserInfo';
import { NoAccessRow } from '../RepositoriesTable/NoAccessRow';

type Props = {
  ownerId: string;
  severityCount: SeverityCount;
  highestVulnerabilityCount: number;
  onNavigate: () => void;
};

export const OwnerTableRow = ({
  ownerId,
  severityCount,
  highestVulnerabilityCount,
  onNavigate,
}: Props) => {
  const navigate = useNavigate();

  const { data: group } = useGroupInfo(ownerId);

  const { critical, high, medium, low, negligible, unknown } = severityCount;
  const total = critical + high + medium + low + negligible + unknown;

  return (
    <>
      <StyledTableRow
        key={ownerId}
        hover
        sx={{ cursor: 'pointer' }}
        onClick={() => {
          navigate(
            `/catalog/default/group/${group?.metadata?.name}/securityMetrics`,
          );
          onNavigate();
        }}
      >
        <TableCell>
          <Typography>{group?.metadata?.name || ownerId}</Typography>
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

export const NoAccessOwnerRow = ({ ownerId }: { ownerId: string }) => {
  const { data: group } = useGroupInfo(ownerId);

  return (
    <NoAccessRow
      name={group?.metadata?.name || ownerId}
      message="Du har ikke tilgang til metrikker for denne eieren"
      colSpan={2}
    />
  );
};

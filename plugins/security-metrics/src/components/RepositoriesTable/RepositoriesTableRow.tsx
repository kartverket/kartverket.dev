import Typography from "@mui/material/Typography"
import { Box, Stack } from "@mui/system"
import type { RosStatus, RepositorySummary } from "../../typesFrontend"
import { StyledTableRow } from "../TableRow"
import { RepositoryScannerStatus } from "./RepositoryScannerStatus"
import { VulnerabilityDistribution } from "../VulnerabilityDistribution"
import { colorMap, labelMap } from "../RosStatus/utils"
import { BASIC_COLORS } from "../../colors"
import { useNavigate } from "react-router-dom"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import TableCell from "@mui/material/TableCell"
import Tooltip from "@mui/material/Tooltip"
import Chip from "@mui/material/Chip"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"

type Props = {
    repository: RepositorySummary
    highestVulnerabilityCount: number
}

const riscLabel = (status: RosStatus) => {
    const color = colorMap[status]
    const label = labelMap[status]
    return (
        <Chip
            label={label}
            size="small"
            sx={{
                backgroundColor: color,
                color: BASIC_COLORS.WHITE,
                mt: 0.5,
                mb: 0.5,
                borderRadius: 1,
            }}
        />
    )
}

export const RepositoriesTableRow = ({
    repository,
    highestVulnerabilityCount,
}: Props) => {
    const navigate = useNavigate()

    const severityCount = repository.severityCount

    const { critical, high, medium, low, negligible, unknown } = severityCount
    const total = critical + high + medium + low + negligible + unknown

    return (
        <StyledTableRow
            key={repository.componentName}
            hover
            sx={{
                cursor: "pointer",
            }}
            onClick={() =>
                navigate(
                    `/catalog/default/component/${repository.componentName}/securityMetrics`,
                )
            }
        >
            <TableCell>
                <Typography>{repository.componentName}</Typography>
            </TableCell>
            <TableCell>
                <Box display="flex" alignItems="center" minHeight="32px">
                    <Box display="flex" gap={1}>
                        {repository.harRos ? (
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
                        {repository.harRos &&
                            repository.rosStatus &&
                            riscLabel(repository.rosStatus)}
                    </Box>
                </Box>
            </TableCell>
            <TableCell>
                <RepositoryScannerStatus repository={repository} />
            </TableCell>
            <TableCell>
                {total > 0 ? (
                    <Stack
                        direction="row"
                        maxWidth="500px"
                        gap={2}
                        alignItems="center"
                    >
                        <Typography width={50}>{total}</Typography>
                        <Box width="100%">
                            <VulnerabilityDistribution
                                severityCount={severityCount}
                                highestVulnerabilityCount={
                                    highestVulnerabilityCount
                                }
                            />
                        </Box>
                    </Stack>
                ) : (
                    <Typography>Ingen sårbarheter</Typography>
                )}
            </TableCell>
            <TableCell>
                <ArrowForwardIosIcon fontSize="small" />
            </TableCell>
        </StyledTableRow>
    )
}

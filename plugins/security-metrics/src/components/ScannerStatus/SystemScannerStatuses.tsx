import {
    getAggregatedScannerStatus,
    getScannerStatusData,
} from "../../mapping/getScannerData"
import { AggregatedScannerStatus, RepositorySummary } from "../../typesFrontend"
import { CardTitle } from "../CardTitle"
import { StyledTableRow } from "../TableRow"
import { ScannerStatusDialog } from "./SystemStatusDialog"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import Typography from "@mui/material/Typography"

interface SystemScannerStatusProps {
    data: RepositorySummary[]
}

export const SystemScannerStatuses = ({ data }: SystemScannerStatusProps) => {
    const repositoryScannerStatus = getScannerStatusData(data)

    const aggregatedStatus = getAggregatedScannerStatus(repositoryScannerStatus)

    if (!aggregatedStatus || aggregatedStatus.length === 0) {
        return (
            <CardTitle title="Skannere">
                <Box px={2}>
                    <Typography data-testid="noData">
                        <i>Vi fant dessverre ingen status på skannere.</i>
                    </Typography>
                </Box>
            </CardTitle>
        )
    }

    return (
        <CardTitle title="Skannere">
            <Box px={2}>
                <Table size="small">
                    <TableBody>
                        {aggregatedStatus.map(
                            (status: AggregatedScannerStatus) => (
                                <StyledTableRow key={status.scannerName}>
                                    <TableCell>
                                        <Typography>
                                            {status.scannerName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <ScannerStatusDialog
                                            scannerStatus={status}
                                        />
                                    </TableCell>
                                </StyledTableRow>
                            ),
                        )}
                    </TableBody>
                </Table>
            </Box>
        </CardTitle>
    )
}

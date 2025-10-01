import { CheckCircleOutlined, HighlightOffOutlined } from "@mui/icons-material"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import {
    AggregatedScannerStatus,
    RepositoryScannerStatusData,
} from "../../typesFrontend"
import Link from "@mui/material/Link"
import Table from "@mui/material/Table"
import TableRow from "@mui/material/TableRow"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import Tooltip from "@mui/material/Tooltip"

type Props = {
    scannerStatus: AggregatedScannerStatus
}

export const ScannerStatusDialog = ({ scannerStatus }: Props) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <>
            <Link component="button" onClick={() => setIsDialogOpen(true)}>
                <Typography>{scannerStatus.status} komponenter</Typography>
            </Link>
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                fullWidth
            >
                <DialogContent>
                    <Typography variant="h6" mb={3}>
                        Skrudd på {scannerStatus.scannerName}
                    </Typography>
                    <Table>
                        <TableBody>
                            {scannerStatus.repositoryStatus
                                .slice()
                                .sort((a, b) => {
                                    const aConfigured = a.scannerStatus.find(
                                        (scanner) =>
                                            scanner.type ===
                                            scannerStatus.scannerName,
                                    )?.on
                                    const bConfigured = b.scannerStatus.find(
                                        (scanner) =>
                                            scanner.type ===
                                            scannerStatus.scannerName,
                                    )?.on
                                    return (
                                        (aConfigured ? 1 : 0) -
                                        (bConfigured ? 1 : 0)
                                    )
                                })
                                .map((status: RepositoryScannerStatusData) => (
                                    <TableRow key={status.componentName}>
                                        <TableCell>
                                            <Typography>
                                                {status.componentName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {status.scannerStatus.find(
                                                (scanner) =>
                                                    scanner.type ===
                                                    scannerStatus.scannerName,
                                            )?.on ? (
                                                <Tooltip title="Konfigurert">
                                                    <CheckCircleOutlined color="success" />
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Ikke konfigurert">
                                                    <HighlightOffOutlined color="error" />
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </>
    )
}

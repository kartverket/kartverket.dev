import TableContainer from "@mui/material/TableContainer"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import {
    getSeverityCountPerSystem,
    getTotalVulnerabilityCount,
} from "../../mapping/getSeverityCounts"
import {
    SeverityCount,
    SikkerhetsmetrikkerSystemTotal,
} from "../../typesFrontend"
import { SystemsTableRow } from "./SystemsTableRow"

type Props = {
    data: SikkerhetsmetrikkerSystemTotal[]
}

export const SystemsTable = ({ data }: Props) => {
    const severityCountPerSystem = getSeverityCountPerSystem(data)

    const getCombinedVulnerabilityCount = (sc: SeverityCount) =>
        getTotalVulnerabilityCount(sc)

    const sortedSystems = [...severityCountPerSystem].sort(
        (a, b) =>
            getCombinedVulnerabilityCount(b.severityCount) -
            getCombinedVulnerabilityCount(a.severityCount),
    )

    const highestVulnerabilityCount = sortedSystems.reduce(
        (max, s) =>
            Math.max(max, getCombinedVulnerabilityCount(s.severityCount)),
        0,
    )

    const notPermittedCount = new Map(
        data.map((s) => [
            s.systemName,
            s.metrics?.notPermittedComponents?.length ?? 0,
        ]),
    )

    const bySystemName = new Map(data.map((s) => [s.systemName, s]))

    const getComponentsFor = (systemName: string): string[] => {
        const sys = bySystemName.get(systemName)
        if (!sys) return []
        const permitted =
            sys.metrics?.permittedMetrics?.map((m) => m.componentName) ?? []
        const notPermitted = sys.metrics?.notPermittedComponents ?? []
        return [...new Set([...permitted, ...notPermitted])].sort((a, b) =>
            a.localeCompare(b),
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: "900px" }} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell width="20%">System</TableCell>
                        <TableCell width="50%">Sårbarheter</TableCell>
                        <TableCell width="30%" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedSystems.map((system) => {
                        const noSystemComponents =
                            system.systemName === "Mangler system"
                                ? getComponentsFor(system.systemName)
                                : []
                        return (
                            <SystemsTableRow
                                key={system.systemName}
                                systemName={system.systemName}
                                notPermittedCount={
                                    notPermittedCount.get(system.systemName) ??
                                    0
                                }
                                severityCount={system.severityCount}
                                highestVulnerabilityCount={
                                    highestVulnerabilityCount
                                }
                                noSystemComponents={noSystemComponents}
                            />
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

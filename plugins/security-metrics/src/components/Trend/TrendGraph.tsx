import { format } from "date-fns"
import { useMemo } from "react"
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    Tooltip,
    Area,
} from "recharts"
import { BASIC_COLORS, SEVERITY_COLORS } from "../../colors"
import { yAxisAdjustment } from "../utils"
import { LinearGradient } from "./LinearGradient"
import { TrendSeverityCounts } from "../../typesFrontend"
import { getAggregatedTrends } from "./utils"
import { useTheme } from "@mui/material/styles"

interface GraphProps {
    trendData: TrendSeverityCounts[]
    graphTimeline: string
}

export const Graph = ({ trendData, graphTimeline }: GraphProps) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"

    const data = useMemo(() => {
        const aggregatedTrends = getAggregatedTrends(trendData)
        return aggregatedTrends.sort(
            (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime(),
        )
    }, [trendData])

    return (
        <ResponsiveContainer
            width="100%"
            height={200}
            style={{ paddingRight: "50px" }}
        >
            <AreaChart data={data}>
                <defs>
                    <LinearGradient id="critical" />
                    <LinearGradient id="high" />
                </defs>
                <XAxis
                    dataKey="timestamp"
                    tickFormatter={(timestamp) =>
                        graphTimeline === "oneYear"
                            ? format(new Date(timestamp), "dd-MM-yyyy")
                            : format(new Date(timestamp), "dd-MM")
                    }
                />
                <YAxis type="number" domain={[0, yAxisAdjustment(data)]} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: isDarkMode
                            ? BASIC_COLORS.DARK_GREY
                            : BASIC_COLORS.WHITE,
                        outlineColor: BASIC_COLORS.LIGHTER_GREY,
                    }}
                    labelFormatter={(timestamp) =>
                        format(new Date(timestamp), "dd-MM-yyyy")
                    }
                />
                <Area
                    type="monotone"
                    dataKey="critical"
                    name="Kritiske sårbarheter"
                    stroke={SEVERITY_COLORS.CRITICAL}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#critical)"
                />
                <Area
                    type="monotone"
                    dataKey="high"
                    name="Høye sårbarheter"
                    stroke={SEVERITY_COLORS.HIGH}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#high)"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

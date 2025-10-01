import { formatDate } from "date-fns"
import { TrendSeverityCounts } from "../../typesFrontend"

/** This function aggregates the trends by date by summing the severity counts for each date.
 * @param trends - The trends to aggregate
 * @returns: TrendSeverityCounts[] - List of aggregated trends
 */
export const getAggregatedTrends = (trends: TrendSeverityCounts[]) => {
    const aggregated: Record<string, TrendSeverityCounts> = {}

    trends.forEach((item) => {
        const date = formatDate(item.timestamp, "yyyy-MM-dd") // Get just the date

        if (!aggregated[date]) {
            aggregated[date] = {
                timestamp: date,
                unknown: 0,
                low: 0,
                medium: 0,
                high: 0,
                critical: 0,
                negligible: 0,
            }
        }
        aggregated[date].unknown += item.unknown
        aggregated[date].negligible += item.negligible
        aggregated[date].low += item.low
        aggregated[date].medium += item.medium
        aggregated[date].high += item.high
        aggregated[date].critical += item.critical
    })

    return Object.values(aggregated)
}

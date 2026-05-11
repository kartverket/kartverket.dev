import { formatDate } from 'date-fns';
import { TrendSeverityCounts } from '../../typesFrontend';

/** This function aggregates the trends by date by summing the severity counts for each date.
 * @param trends - The trends to aggregate
 * @returns: TrendSeverityCounts[] - List of aggregated trends
 */
export const getAggregatedTrends = (trends: TrendSeverityCounts[]) => {
  const aggregated: Record<string, TrendSeverityCounts> = {};

  trends.forEach(item => {
    const date = formatDate(item.timestamp, 'yyyy-MM-dd');

    if (!aggregated[date]) {
      aggregated[date] = {
        timestamp: date,
        total: 0,
        unknown: 0,
        negligible: 0,
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
        openTotal: 0,
        openUnknown: 0,
        openLow: 0,
        openMedium: 0,
        openHigh: 0,
        openCritical: 0,
      };
    }

    aggregated[date].unknown += item.unknown;
    aggregated[date].negligible += item.negligible;
    aggregated[date].low += item.low;
    aggregated[date].medium += item.medium;
    aggregated[date].high += item.high;
    aggregated[date].critical += item.critical;

    aggregated[date].openUnknown += item.openUnknown ?? 0;
    aggregated[date].openLow += item.openLow ?? 0;
    aggregated[date].openMedium += item.openMedium ?? 0;
    aggregated[date].openHigh += item.openHigh ?? 0;
    aggregated[date].openCritical += item.openCritical ?? 0;

    aggregated[date].total +=
      item.unknown +
      item.negligible +
      item.low +
      item.medium +
      item.high +
      item.critical;
    
    aggregated[date].openTotal +=
      (item.openUnknown ?? 0) +
      (item.openLow ?? 0) +
      (item.openMedium ?? 0) +
      (item.openHigh ?? 0) +
      (item.openCritical ?? 0);
  });

  return Object.values(aggregated);
};

import { TrendSeverityCounts } from '../../typesFrontend';

type TrendSeverityCountsWithOpen = TrendSeverityCounts & {
  openTotal: number | null;
  openNegligible: number;
  openUnknown: number;
  openLow: number;
  openMedium: number;
  openHigh: number;
  openCritical: number;
};

const hasOpenCounts = (
  item: TrendSeverityCounts,
): item is TrendSeverityCountsWithOpen =>
  item.openUnknown !== null &&
  item.openNegligible !== null &&
  item.openLow !== null &&
  item.openMedium !== null &&
  item.openHigh !== null &&
  item.openCritical !== null;

export const getAggregatedTrends = (trends: TrendSeverityCounts[]) => {
  const aggregated: Record<string, TrendSeverityCounts> = {};

  trends.forEach(item => {
    const date = item.date;

    if (!aggregated[date]) {
      aggregated[date] = {
        date: date,
        total: 0,
        unknown: 0,
        negligible: 0,
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,

        openTotal: null,
        openNegligible: null,
        openUnknown: null,
        openLow: null,
        openMedium: null,
        openHigh: null,
        openCritical: null,
      };
    }

    aggregated[date].unknown += item.unknown;
    aggregated[date].negligible += item.negligible;
    aggregated[date].low += item.low;
    aggregated[date].medium += item.medium;
    aggregated[date].high += item.high;
    aggregated[date].critical += item.critical;

    aggregated[date].total +=
      item.unknown +
      item.negligible +
      item.low +
      item.medium +
      item.high +
      item.critical;

    if (hasOpenCounts(item)) {
      aggregated[date].openNegligible =
        (aggregated[date].openNegligible ?? 0) + item.openNegligible;

      aggregated[date].openUnknown =
        (aggregated[date].openUnknown ?? 0) + item.openUnknown;

      aggregated[date].openLow = (aggregated[date].openLow ?? 0) + item.openLow;

      aggregated[date].openMedium =
        (aggregated[date].openMedium ?? 0) + item.openMedium;

      aggregated[date].openHigh =
        (aggregated[date].openHigh ?? 0) + item.openHigh;

      aggregated[date].openCritical =
        (aggregated[date].openCritical ?? 0) + item.openCritical;

      aggregated[date].openTotal =
        (aggregated[date].openTotal ?? 0) +
        item.openUnknown +
        item.openNegligible +
        item.openLow +
        item.openMedium +
        item.openHigh +
        item.openCritical;
    }
  });

  return Object.values(aggregated);
};

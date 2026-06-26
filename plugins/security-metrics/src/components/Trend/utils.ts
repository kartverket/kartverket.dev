import { TrendSeverityCounts } from '../../typesFrontend';

export type TrendDataPoint = TrendSeverityCounts & {
  total: number;
  openTotal: number | null;
};

export const getAggregatedTrends = (
  trends: TrendSeverityCounts[],
): TrendDataPoint[] => {
  return trends.map(item => {
    const total =
      item.unknown +
      item.negligible +
      item.low +
      item.medium +
      item.high +
      item.critical;

    const hasOpen =
      item.openUnknown !== null &&
      item.openNegligible !== null &&
      item.openLow !== null &&
      item.openMedium !== null &&
      item.openHigh !== null &&
      item.openCritical !== null;

    const openTotal = hasOpen
      ? (item.openUnknown ?? 0) +
        (item.openNegligible ?? 0) +
        (item.openLow ?? 0) +
        (item.openMedium ?? 0) +
        (item.openHigh ?? 0) +
        (item.openCritical ?? 0)
      : null;

    return {
      ...item,
      total,
      openTotal,
    };
  });
};

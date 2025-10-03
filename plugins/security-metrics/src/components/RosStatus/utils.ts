import { BASIC_COLORS, SEVERITY_COLORS } from '../../colors';
import { RosStatus } from '../../typesFrontend';

export const colorMap: Record<RosStatus, string> = {
  Unknown: BASIC_COLORS.GREY,
  VeryOutdated: SEVERITY_COLORS.CRITICAL,
  Outdated: SEVERITY_COLORS.HIGH,
  SomewhatOutdated: SEVERITY_COLORS.MEDIUM,
  Recent: BASIC_COLORS.SUCCESS,
};

export const labelMap: Record<RosStatus, string> = {
  Unknown: 'Ukjent status',
  VeryOutdated: 'Veldig utdatert',
  Outdated: 'Utdatert',
  SomewhatOutdated: 'Noe utdatert',
  Recent: 'Nylig oppdatert',
};

export const calculateDaysSince = (lastPublishedRisc: string): number => {
  const now = new Date();
  const rosDate = new Date(lastPublishedRisc);
  return Math.ceil((now.getTime() - rosDate.getTime()) / (1000 * 60 * 60 * 24));
};

export const getDaysColor = (days: number, isDarkMode: boolean) => {
  if (days <= 30)
    return isDarkMode ? BASIC_COLORS.WHITE : BASIC_COLORS.DARK_GREY;
  if (days <= 90) return colorMap.SomewhatOutdated;
  if (days <= 180) return colorMap.Outdated;
  return colorMap.VeryOutdated;
};

export const getCommitsColor = (commits: number, isDarkMode: boolean) => {
  if (commits <= 10)
    return isDarkMode ? BASIC_COLORS.WHITE : BASIC_COLORS.DARK_GREY;
  if (commits <= 25) return colorMap.SomewhatOutdated;
  if (commits <= 50) return colorMap.Outdated;
  return colorMap.VeryOutdated;
};

export const plural = (n: number, one: string, many: string) =>
  n === 1 ? one : many;

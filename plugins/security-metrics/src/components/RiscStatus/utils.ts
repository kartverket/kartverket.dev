import { BASIC_COLORS, SEVERITY_COLORS } from '../../colors';

export const calculateDaysSince = (lastPublishedRisc: string): number => {
  const now = new Date();
  const rosDate = new Date(lastPublishedRisc);
  return Math.ceil((now.getTime() - rosDate.getTime()) / (1000 * 60 * 60 * 24));
};

export const plural = (n: number, one: string, many: string) =>
  n === 1 ? one : many;

export const riscTextColor = (backgroundColor: string): string => {
  if (backgroundColor === SEVERITY_COLORS.LOW) {
    return BASIC_COLORS.BLACK;
  }
  return BASIC_COLORS.WHITE;
};

export const daysSince = (dateString: string): number | null => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

export const riscColor = (lastPublishedRisc: string): string => {
  const days = daysSince(lastPublishedRisc);

  if (days === null) {
    return SEVERITY_COLORS.UNKNOWN;
  }

  if (days <= 90) {
    return 'success.main';
  }

  if (days <= 180) {
    return SEVERITY_COLORS.LOW;
  }

  if (days <= 270) {
    return SEVERITY_COLORS.MEDIUM;
  }

  if (days <= 365) {
    return SEVERITY_COLORS.HIGH;
  }

  return SEVERITY_COLORS.CRITICAL;
};

export const riscLabelText = (lastPublishedRisc: string): string => {
  const days = daysSince(lastPublishedRisc);

  if (days === null) {
    return 'Ukjent';
  }

  if (days === 0) {
    return 'I dag';
  }

  if (days === 1) {
    return '1 dag siden';
  }

  return `${days} dager siden`;
};

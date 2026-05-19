import {
  FilterEnum,
  GraphTimeline,
  Scanner,
  Severity,
  SikkerhetsmetrikkerSystemTotal,
  TrendSeverityCounts,
} from '../typesFrontend';
import { SCANNER_COLORS, SEVERITY_COLORS } from '../colors';

export const getStandardSeverityFormat = (severity: Severity) => {
  switch (severity) {
    case 'critical':
      return 'Kritisk';
    case 'high':
      return 'Høy';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Lav';
    case 'negligible':
      return 'Ubetydelig';
    case 'unknown':
      return 'Uvisst';
    default:
      return '';
  }
};

export const SeverityColors = {
  critical: SEVERITY_COLORS.CRITICAL,
  high: SEVERITY_COLORS.HIGH,
  medium: SEVERITY_COLORS.MEDIUM,
  low: SEVERITY_COLORS.LOW,
  negligible: SEVERITY_COLORS.NEGLIGIBLE,
  unknown: SEVERITY_COLORS.UNKNOWN,
};

export const getScannerColor = (scanner: string) => {
  switch (scanner) {
    case Scanner.CodeQL:
      return SCANNER_COLORS.CODEQL;
    case Scanner.Dependabot:
      return SCANNER_COLORS.DEPENDABOT;
    case Scanner.Pharos:
      return SCANNER_COLORS.PHAROS;
    case Scanner.Sysdig:
      return SCANNER_COLORS.SYSDIG;
    default:
      return SCANNER_COLORS.UNKNOWN;
  }
};

export const getFromDate = (
  graphTimeline: GraphTimeline,
  todayDate: Date,
): Date => {
  const date = new Date(todayDate);

  switch (graphTimeline) {
    case 'fourteenDays':
      date.setDate(date.getDate() - 14);
      return date;
    case 'oneMonth':
      date.setMonth(date.getMonth() - 1);
      return date;
    case 'threeMonths':
      date.setMonth(date.getMonth() - 3);
      return date;
    case 'sixMonths':
      date.setMonth(date.getMonth() - 6);
      return date;
    case 'oneYear':
      date.setFullYear(date.getFullYear() - 1);
      return date;
    default:
      date.setMonth(date.getMonth() - 1);
      return date;
  }
};

export const yAxisAdjustment = (
  severityCounts: TrendSeverityCounts[],
  showOpen: boolean,
) => {
  const highestCountForSeverities = severityCounts.map(count => {
    if (showOpen) {
      return Math.max(count.openCritical ?? 0, count.openHigh ?? 0);
    }

    return Math.max(count.critical, count.high);
  });

  return Math.max(...highestCountForSeverities, 0);
};

const SEVERITY_GRAPH_COLORS = [
  SEVERITY_COLORS.CRITICAL,
  SEVERITY_COLORS.HIGH,
  SEVERITY_COLORS.MEDIUM,
  SEVERITY_COLORS.LOW,
  SEVERITY_COLORS.NEGLIGIBLE,
  SEVERITY_COLORS.UNKNOWN,
];

export const SEVERITY_ORDER: Severity[] = [
  'critical',
  'high',
  'medium',
  'low',
  'negligible',
  'unknown',
];

export const getSeverityColor = (severity: Severity) =>
  SEVERITY_GRAPH_COLORS[
    SEVERITY_ORDER.indexOf(severity) % SEVERITY_GRAPH_COLORS.length
  ];

export const isExperimentalLifecycle = (value: unknown): value is string =>
  typeof value === 'string' && value.toLowerCase() === 'experimental';

export const isDocumentationType = (value: unknown): value is string =>
  typeof value === 'string' && value.toLowerCase() === 'documentation';

export const filterSystemsByComponents = (
  data: SikkerhetsmetrikkerSystemTotal[] | undefined,
  repoNames: Set<string>,
  filter: FilterEnum,
): SikkerhetsmetrikkerSystemTotal[] | undefined => {
  if (!data || filter === 'all') return data;

  return data
    .map(system => ({
      ...system,
      metrics: {
        ...system.metrics,
        permittedMetrics: system.metrics.permittedMetrics.filter(pm =>
          repoNames.has(pm.repoName),
        ),
      },
    }))
    .filter(system => system.metrics.permittedMetrics.length > 0);
};

export const severityLegendSorter = (item: any) =>
  SEVERITY_ORDER.indexOf(item?.payload?.key ?? 'unknown');

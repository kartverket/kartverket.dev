import {
  Scanner,
  Severity,
  SikkerhetsmetrikkerSystemTotal,
  TrendSeverityCounts,
  Vulnerability,
} from '../typesFrontend';
import { SCANNER_COLORS, SEVERITY_COLORS } from '../colors';
import { Entity } from '@backstage/catalog-model';
import { FilterEnum } from './StarFilterButton';

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

export const getFromDate = (graphTimeline: string, todayDate: Date): Date => {
  switch (graphTimeline) {
    case 'oneYear':
      return new Date(new Date().setFullYear(todayDate.getFullYear() - 1));
    case 'oneWeek':
      return new Date(new Date().setDate(todayDate.getDate() - 7));
    default:
      return new Date(new Date().setMonth(todayDate.getMonth() - 1));
  }
};

export const yAxisAdjustment = (severityCounts: TrendSeverityCounts[]) => {
  const highestCountForSeverities = severityCounts.map(count => {
    return Math.max(count.critical, count.high);
  });

  return Math.max(...highestCountForSeverities);
};

export const SEVERITY_GRAPH_COLORS = [
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

export const getComponentRefs = (
  entity: Entity,
  relationType: string,
): string[] =>
  entity.relations
    ?.filter(
      r =>
        r.type === relationType &&
        r.targetRef.toLowerCase().startsWith('component'),
    )
    .map(r => r.targetRef) ?? [];

export const getRepositoryNames = (entities: Entity[]): string[] => {
  return entities
    .filter(entity => entity?.spec?.lifecycle !== 'experimental')
    .map(
      entity => entity.metadata.annotations?.['backstage.io/source-location'],
    )
    .filter((repo): repo is string => typeof repo === 'string')
    .map(repo => {
      const match = repo.match(
        /^url:https:\/\/github\.com\/kartverket\/([^\/]+)(?:\/|$)/,
      );
      return match ? match[1] : undefined;
    })
    .filter((name): name is string => Boolean(name));
};

export const findBestId = (vulnerability: Vulnerability) => {
  const cveId = vulnerability.vulnerabilityIdInfo.filter(
    vulnerabilityId => vulnerabilityId.type === 'CVE',
  );
  const cweIds = vulnerability.vulnerabilityIdInfo.filter(
    vulnerabilityId => vulnerabilityId.type === 'cwe',
  );
  const otherIds = vulnerability.vulnerabilityIdInfo.filter(
    vulnerabilityId =>
      vulnerabilityId.type !== 'cwe' && vulnerabilityId.type !== 'CVE',
  );

  let shownId = [];
  if (cveId.length !== 0) shownId = cveId;
  else if (cweIds.length !== 0) shownId = cweIds;
  else shownId = otherIds;
  return shownId[0].id;
};

export const filterSystemsByComponents = (
  data: SikkerhetsmetrikkerSystemTotal[] | undefined,
  componentNames: Set<string>,
  filter: FilterEnum,
): SikkerhetsmetrikkerSystemTotal[] | undefined => {
  if (!data || filter === 'all') return data;

  return data
    .map(system => ({
      ...system,
      metrics: {
        ...system.metrics,
        permittedMetrics: system.metrics.permittedMetrics.filter(pm =>
          componentNames.has(pm.componentName),
        ),
      },
    }))
    .filter(system => system.metrics.permittedMetrics.length > 0);
};

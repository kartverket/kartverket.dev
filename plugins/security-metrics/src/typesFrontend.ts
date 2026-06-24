export enum Scanner {
  CodeQL = 'CodeQL',
  Dependabot = 'Dependabot',
  Pharos = 'Pharos',
  Sysdig = 'Sysdig',
}

export type ScannerAlertInfo = {
  alertId: string;
  htmlUrl: string;
};

export type DependabotSpecificInfo = {
  alerts: ScannerAlertInfo[];
  isFixable: boolean;
  isDirect: boolean;
};

export type CodeQlSpecificInfo = {
  alerts: ScannerAlertInfo[];
  branch: string[];
  locations: number;
};

export type PharosSpecificInfo = {
  alerts: ScannerAlertInfo[];
  branch: string;
};

export type SysdigSpecificInfo = {
  htmlUrl: string;
  findingCount: number;
  containerNames: string[];
  locations: { cluster: string; namespace: string }[];
  isExploitable: boolean;
  isRunning: boolean;
  packages: string[];
  isFixable: boolean;
  isCisaKEV: boolean;
};

export type ScannerSpecificInfo = {
  dependabotInfo?: DependabotSpecificInfo;
  codeQLInfo?: CodeQlSpecificInfo;
  pharosInfo?: PharosSpecificInfo;
  sysdigInfo?: SysdigSpecificInfo;
};

export type Repository = {
  componentName: string;
  severityCount: SeverityCount;
  openSeverityCount: SeverityCount;
  secrets: { alerts: SecretAlert[] };
  riscStatus: RiscStatusData;
  scannerConfig: ScannerConfig;
  vulnerabilities: Vulnerability[];
  averageTimeToSolveVulnerabilityDays?: number;
};

export type VulnerabilityIdInfo = {
  type: string;
  id: string;
  url?: string;
};

export type Status = 'IKKE_STARTET' | 'PABEGYNT' | 'AKSEPTERT';

export type Vulnerability = {
  vulnerabilityId: string;
  vulnerabilityIdInfo: VulnerabilityIdInfo[];
  severity: Severity;
  scanners: Scanner[];
  summary: string;
  dateFirstSeen: string;
  statusInfo: VulnerabilityStatusInfo;
  severityUpdatedAt?: string;
  scannerSpecificInfo: ScannerSpecificInfo;
};

export type VulnerabilityStatusInfo =
  | {
      state: 'loaded';
      status: Status | null;
      changedAt: Date | null;
      comment: string | null;
      changedBy: string | null;
    }
  | {
      state: 'error';
    };

export type SecretAlert = {
  createdAt: string;
  summary: string;
  secretValue: string;
  htmlUrl?: string;
  bypassed: boolean;
  bypassedBy?: GithubBypassed;
};

export type GithubBypassed = {
  handle: string;
  name: string;
  email: string;
  isRepositoryAdmin: boolean;
};

export type RepositorySummary = {
  repoName: string;
  componentNames: string[];
  severityCount: SeverityCount;
  openSeverityCount: SeverityCount;
  secrets: { alerts: SecretAlert[] };
  scannerConfig: ScannerConfig;
  riscStatus: RiscStatusData;
  averageTimeToSolveVulnerabilityDays?: number;
};

export type SikkerhetsmetrikkerOwnerTotal = {
  permittedOwnerMetrics: OwnerSeverityCounts[];
  notPermittedOwners: string[];
};

export type OwnerSeverityCounts = {
  owner: string;
  severityCount: SeverityCount;
  openSeverityCount: SeverityCount;
};

export type OverviewResponse = {
  notPermittedComponents: string[];
  severityCount: SeverityCount;
  openSeverityCount: SeverityCount;
  secrets: { componentNames: string[]; secrets: { alerts: SecretAlert[] } }[];
  scannerConfig: { componentNames: string[]; scannerConfig: ScannerConfig }[];
  riscStatus: RiscStatusData[];
};

export type ComponentsResponse = {
  notPermittedComponents: string[];
  components: ComponentMetricsSummary[];
};

export type ComponentMetricsSummary = {
  componentNames: string[];
  repoName: string;
  riscStatus: RiscStatusData;
  averageTimeToSolveVulnerabilityDays: number | null;
  scannerConfig: ScannerConfig;
  severityCount: SeverityCount;
  openSeverityCount: SeverityCount;
};

export type SystemSeverityCounts = {
  systemName: string;
  severityCount: SeverityCount;
  openSeverityCount: SeverityCount;
  notPermittedComponents: string[];
};

export type UniqueVulnerabilities = {
  totalCount: number;
  vulnerabilities: AggregatedVulnerability[];
};

export type AggregatedVulnerability = {
  vulnerabilityId: string;
  severity: Severity;
  summary: string;
  affectedComponents: string[];
};

export type ScannerConfig = {
  dependabot: boolean;
  codeQL: boolean;
  pharos: boolean;
  sysdig: boolean;
};

export type TrendSeverityCounts = {
  date: string;
  unknown: number;
  negligible: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
  openUnknown: number | null;
  openNegligible: number | null;
  openLow: number | null;
  openMedium: number | null;
  openHigh: number | null;
  openCritical: number | null;
};

export type SeverityCount = {
  unknown: number;
  negligible: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
};

export type RepositoryScannerStatusData = {
  componentNames: string[];
  scannerStatus: ScannerStatus[];
};

export type ScannerStatus = {
  type: Scanner;
  on: boolean;
};

export interface RiscStatusData {
  repositoryName?: string;
  hasRisc?: boolean;
  lastPublishedRisc?: string;
  commitsSincePublishedRisc?: number;
}

export type Severity =
  | 'unknown'
  | 'negligible'
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type AggregatedScannerStatus = {
  scannerName: Scanner;
  status: string;
  repositoryStatus: RepositoryScannerStatusData[];
};

export type SecretsOverview = {
  componentName: string;
  alerts: SecretAlert[];
};

export type ClusterSummary = {
  clusterName: string;
  groups: {
    namespaces: string[];
    vulnerabilities: Vulnerability[];
  }[];
};

export type NamespaceMap = Map<string, Vulnerability[]>;
export type ClusterMap = Map<string, NamespaceMap>;

export type FilterEnum = 'all' | 'starred';

export type MetricsUpdateStatus = {
  dependabotLastUpdated: string;
  sysdigLastUpdated: string;
  codeScanningLastUpdated: string;
  secretScanningLastUpdated: string;
  riscMetricsLastUpdated: string;
};

export type ErrorResponse = {
  status: number;
  code: string;
  message: string;
};

export type GraphTimeline =
  | 'fourteenDays'
  | 'oneMonth'
  | 'threeMonths'
  | 'sixMonths'
  | 'oneYear';

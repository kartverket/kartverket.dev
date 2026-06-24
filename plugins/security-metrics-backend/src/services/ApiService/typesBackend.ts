export type MetricsUpdateStatus = {
  dependabotLastUpdated: string;
  sysdigLastUpdated: string;
  codeScanningLastUpdated: string;
  secretScanningLastUpdated: string;
  riscMetricsLastUpdated: string;
};

export type FetchMetricsRequestBody = {
  componentNames: string[];
  entraIdToken: string;
};

export type FetchTrendsRequestBody = {
  componentNames: string[];
  fromDate: Date;
  toDate: Date;
  entraIdToken: string;
};

export type GithubBypassed = {
  handle: string;
  name: string;
  email: string;
  isRepositoryAdmin: boolean;
};

export type SecretAlert = {
  createdAt: string;
  summary: string;
  secretValue: string;
  htmlUrl?: string;
  bypassed: boolean;
  bypassedBy?: GithubBypassed;
};

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
  dependabotSpecificInfo?: DependabotSpecificInfo;
  codeQlSpecificInfo?: CodeQlSpecificInfo;
  pharosSpecificInfo?: PharosSpecificInfo;
  sysdigSpecificInfo?: SysdigSpecificInfo;
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
  severityUpdatedAt?: string;
  status: Status;
  changedAt: Date;
  comment: string;
  changedBy: string;
  scannerSpecificInfo: ScannerSpecificInfo;
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

export type UniqueVulnerabilities = {
  totalCount: number;
  vulnerabilities: AggregatedVulnerability[];
};

export type AggregatedVulnerability = {
  vulnerabilityId: string;
  severity: Severity;
  scanners: Scanner[];
  summary: string;
  dateFirstSeen: string;
  affectedComponents: string[];
};

export type Severity =
  | 'unknown'
  | 'negligible'
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type Scanner = 'Dependabot' | 'CodeQL' | 'Pharos' | 'Sysdig';

export type ScannerConfig = {
  dependabot: boolean;
  codeQl: boolean;
  pharos: boolean;
  sysdig: boolean;
};

export interface RiscStatusData {
  repositoryName?: string;
  hasRisc?: boolean;
  lastPublishedRisc?: string;
  commitsSincePublishedRisc?: number;
}

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

export type SeverityCounts = {
  date: string;
  unknown: number;
  negligible: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
  openNegligible: number | null;
  openUnknown: number | null;
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

export type ChangeStatusRequestBody = {
  componentName: string;
  vulnerabilityId: string;
  status: Status;
  comment?: string;
  changedBy?: string;
  entraIdToken: string;
};

export type ConfigureNotificationsRequestBody = {
  teamName: string;
  componentNames: string[];
  channelId: string;
  entraIdToken: string;
  severity?: string[];
};

export type SlackNotificationConfig = {
  teamName: string;
  channelId: string;
  severity: string[];
  componentNames: string[];
};

export type ErrorResponse = {
  status: number;
  code: string;
  message: string;
};

export type ErrorBody = {
  status?: number;
  code?: string;
  message?: string;
};

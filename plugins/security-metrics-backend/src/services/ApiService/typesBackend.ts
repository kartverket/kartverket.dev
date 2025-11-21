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
  bypassed: boolean;
  bypassedBy?: GithubBypassed;
};

export type DependabotSpecificInfo = {
  htmlUrl: string;
};

export type CodeQlSpecificInfo = {
  htmlUrl: string;
  branch: string;
  locations: number;
};

export type PharosSpecificInfo = {
  htmlUrl: string;
  branch: string;
};

export type SysdigSpecificInfo = {
  htmlUrl: string;
  containerNames: string[];
  locations: { cluster: string; namespace: string }[];
  isExploitable: Boolean;
  isRunning: Boolean;
  packages: string[];
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
  secrets: { alerts: SecretAlert[] };
  rosStatus: RosStatusData;
  scannerConfig: ScannerConfig;
  vulnerabilities: Vulnerability[];
  averageTimeToSolveVulnerabilityDays?: number;
};

export type VulnerabilityIdInfo = {
  type: string;
  id: string;
  url?: string;
};

export type Vulnerability = {
  vulnerabilityId: string;
  vulnerabilityIdInfo: VulnerabilityIdInfo[];
  severity: Severity;
  scanners: Scanner[];
  summary: string;
  dateFirstSeen: string;
  acceptedAt: Date;
  comment: string;
  acceptedBy: string;
  scannerSpecificInfo: ScannerSpecificInfo;
};

export type RepositorySummary = {
  componentName: string;
  severityCount: SeverityCount;
  secrets: { alerts: SecretAlert[] };
  scannerConfig: ScannerConfig;
  harRos: Boolean;
  rosStatus: RosStatus;
  averageTimeToSolveVulnerabilityDays?: number;
};

export type SikkerhetsmetrikkerTotal = {
  permittedMetrics: RepositorySummary[];
  notPermittedComponents: string[];
};

export type SikkerhetsmetrikkerSystemTotal = {
  systemName: string;
  metrics: SikkerhetsmetrikkerTotal;
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

export interface RosStatusData {
  hasRosAsCode: Boolean;
  lastPublishedRisc?: string;
  commitsSincePublishedRisc?: number;
}

export type RosStatus =
  | 'Unknown'
  | 'VeryOutdated'
  | 'Outdated'
  | 'SomewhatOutdated'
  | 'Recent';

export type VulnerabilitySeverityCounts = {
  repoName: string;
  severityCounts: SeverityCounts[];
};

export type SeverityCounts = {
  timestamp: Date;
  unknown: number;
  negligible: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
};

export type SeverityCount = {
  unknown: number;
  negligible: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
};

export type SecurityChamp = {
  repositoryName: string;
  securityChampionEmail: string;
};

export type AcceptVulnerabilityRequestBody = {
  componentName: string;
  vulnerabilityId: string;
  comment?: string;
  acceptedBy?: string;
  entraIdToken: string;
};

export type ConfigureNotificationsRequestBody = {
  teamName: string;
  componentNames: string[];
  channelName: string;
  entraIdToken: string;
};

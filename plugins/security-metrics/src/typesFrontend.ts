export enum Scanner {
  CodeQL = 'CodeQL',
  Dependabot = 'Dependabot',
  Pharos = 'Pharos',
  Sysdig = 'Sysdig',
}

export type DependabotSpecificInfo = {
  htmlUrl: string;
  isDirect: boolean;
  isFixable: boolean;
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

export type Status = 'IKKE_STARTET' | 'PABEGYNT' | 'AKSEPTERT';

export type Vulnerability = {
  vulnerabilityId: string;
  vulnerabilityIdInfo: VulnerabilityIdInfo[];
  severity: Severity;
  scanners: Scanner[];
  summary: string;
  dateFirstSeen: string;
  status: Status;
  changedAt: Date;
  comment: string;
  changedBy: string;
  scannerSpecificInfo: ScannerSpecificInfo;
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

export type ScannerConfig = {
  dependabot: boolean;
  codeQL: boolean;
  pharos: boolean;
  sysdig: boolean;
};

export type TrendSeverityCounts = {
  timestamp: string;
  total: number;
} & SeverityCount;

export type SeverityCount = {
  unknown: number;
  negligible: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
};

export type RepositoryScannerStatusData = {
  componentName: string;
  scannerStatus: ScannerStatus[];
};

export type ScannerStatus = {
  type: Scanner;
  on: boolean;
};

export interface RosStatusData {
  hasRosAsCode: Boolean;
  lastPublishedRisc: string;
  commitsSincePublishedRisc: number;
}

export type RosStatus =
  | 'Unknown'
  | 'VeryOutdated'
  | 'Outdated'
  | 'SomewhatOutdated'
  | 'Recent';

export type ScannerType = 'Dependabot' | 'CodeQL' | 'Pharos' | 'Sysdig';

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

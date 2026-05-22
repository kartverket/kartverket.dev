export const MetricTypes = {
  componentMetrics: 'component-metrics',
  metrics: 'metrics',
  trends: 'trends',
  riscStatus: 'risc-status',
  changeStatusVulnerability: 'change-status-vulnerability',
  configureNotifications: 'configure-notifications',
  metricsUpdateStatus: 'metrics-update-status',
} as const;

export type MetricType = (typeof MetricTypes)[keyof typeof MetricTypes];

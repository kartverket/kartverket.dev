import { Scanner } from '../../typesFrontend';
import type {
  AggregatedVulnerability,
  Severity,
  Vulnerability,
} from '../../typesFrontend';

export type RiskInputs = {
  severity: Severity;
  isCisaKEV: boolean;
  isExploitable: boolean;
  isFixable: boolean;
  runningFraction: number | null;
};

const SEVERITY_BASE: Partial<Record<Severity, number>> = {
  critical: 40,
  high: 25,
  medium: 12,
  low: 4,
};

const reachMultiplier = (fraction: number | null) => {
  if (fraction === null) return 0.6;
  if (fraction === 0) return 0.15;
  return 0.7 + 0.3 * fraction;
};

const threatMultiplier = (r: RiskInputs) => {
  if (r.isCisaKEV) return 2.0;
  if (r.isExploitable) return 1.4;
  return 1.0;
};

export const computeRiskScore = (r: RiskInputs): number => {
  const base = SEVERITY_BASE[r.severity] ?? 2;
  const score = Math.round(
    base * threatMultiplier(r) * reachMultiplier(r.runningFraction),
  );
  return r.isCisaKEV ? Math.max(score, 60) : score;
};

export const aggregatedToRiskInputs = (
  v: AggregatedVulnerability,
): RiskInputs => {
  let runningFraction: number | null = null;
  if (v.scanners.includes(Scanner.Sysdig)) {
    const total = v.affectedComponents.length;
    const running = v.affectedComponents.filter(
      c => c.isRunning === true,
    ).length;
    runningFraction = total ? running / total : 0;
  }
  return {
    severity: v.severity,
    isCisaKEV: v.isCisaKEV,
    isExploitable: v.isExploitable,
    isFixable: v.isFixable,
    runningFraction,
  };
};

export const vulnerabilityToRiskInputs = (v: Vulnerability): RiskInputs => {
  const sysdig = v.scannerSpecificInfo.sysdigInfo;
  const dependabot = v.scannerSpecificInfo.dependabotInfo;
  let runningFraction: number | null = null;
  if (v.scanners.includes(Scanner.Sysdig) && sysdig) {
    runningFraction = sysdig.isRunning ? 1 : 0;
  }
  return {
    severity: v.severity,
    isCisaKEV: !!sysdig?.isCisaKEV,
    isExploitable: !!sysdig?.isExploitable,
    isFixable: !!(sysdig?.isFixable || dependabot?.isFixable),
    runningFraction,
  };
};

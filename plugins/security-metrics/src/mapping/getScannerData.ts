import {
  AggregatedScannerStatus,
  Repository,
  RepositoryScannerStatusData,
  RepositorySummary,
  Scanner,
} from '../typesFrontend';

const getScannerBooleans = (r: Repository | RepositorySummary) => ({
  dependabot: r.scannerConfig.dependabot,
  codeql: r.scannerConfig.codeQL,
  pharos: r.scannerConfig.pharos,
  sysdig: r.scannerConfig.sysdig,
});

export const getScannerStatusData = (
  input: Repository | RepositorySummary[],
): RepositoryScannerStatusData[] => {
  const items = Array.isArray(input) ? input : [input];
  return items.map(r => {
    const s = getScannerBooleans(r);
    return {
      componentName: r.componentName,
      scannerStatus: [
        { type: Scanner.Dependabot, on: s.dependabot },
        { type: Scanner.CodeQL, on: s.codeql },
        { type: Scanner.Pharos, on: s.pharos },
        { type: Scanner.Sysdig, on: s.sysdig },
      ],
    };
  });
};

export const getAggregatedScannerStatus = (
  rows: RepositoryScannerStatusData[],
): AggregatedScannerStatus[] => {
  const scanners = Object.values(Scanner);

  return scanners.map(scanner => {
    let on = 0;
    let off = 0;
    for (const repo of rows) {
      const s = repo.scannerStatus.find(x => x.type === scanner);
      if (s) {
        if (s.on) on++;
        else off++;
      }
    }
    return {
      scannerName: scanner,
      status: `${on}/${on + off}`,
      repositoryStatus: rows,
    };
  });
};

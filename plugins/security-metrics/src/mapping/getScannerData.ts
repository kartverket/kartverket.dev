import {
  AggregatedScannerStatus,
  RepositoryScannerStatusData,
  Scanner,
  ScannerConfig,
} from '../typesFrontend';

export const getScannerStatusData = (
  input: { componentNames: string[]; scannerConfig: ScannerConfig }[],
): RepositoryScannerStatusData[] => {
  return input.map(item => ({
    componentNames: item.componentNames,
    scannerStatus: [
      { type: Scanner.Dependabot, on: item.scannerConfig.dependabot },
      { type: Scanner.CodeQL, on: item.scannerConfig.codeQL },
      { type: Scanner.Pharos, on: item.scannerConfig.pharos },
      { type: Scanner.Sysdig, on: item.scannerConfig.sysdig },
    ],
  }));
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

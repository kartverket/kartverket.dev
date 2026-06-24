import { ScannerConfig } from '../../typesFrontend';

const getScannerStatus = (scannerConfig: ScannerConfig) => [
  { name: 'Dependabot', status: scannerConfig.dependabot },
  { name: 'CodeQL', status: scannerConfig.codeQL },
  { name: 'Pharos', status: scannerConfig.pharos },
  { name: 'Sysdig', status: scannerConfig.sysdig },
];

export const getScannersGroupedByStatus = (scannerConfig: ScannerConfig) => {
  const scannerStatus = getScannerStatus(scannerConfig);

  return {
    configured: scannerStatus
      .filter(scanner => scanner.status)
      .map(scanner => scanner.name),
    notConfigured: scannerStatus
      .filter(scanner => !scanner.status)
      .map(scanner => scanner.name),
  };
};

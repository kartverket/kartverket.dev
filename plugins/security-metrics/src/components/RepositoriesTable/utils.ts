import { RepositorySummary } from "../../typesFrontend"

export const getScannerStatus = (repository: RepositorySummary) => [
    { name: "Dependabot", status: repository.scannerConfig.dependabot },
    { name: "CodeQL", status: repository.scannerConfig.codeQL },
    { name: "Pharos", status: repository.scannerConfig.pharos },
    { name: "Sysdig", status: repository.scannerConfig.sysdig },
]

export const getScannersGroupedByStatus = (repository: RepositorySummary) => {
    const scannerStatus = getScannerStatus(repository)

    return {
        configured: scannerStatus
            .filter((scanner) => scanner.status)
            .map((scanner) => scanner.name),
        notConfigured: scannerStatus
            .filter((scanner) => !scanner.status)
            .map((scanner) => scanner.name),
    }
}

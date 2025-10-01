import { Secrets } from "../components/SecretsOverview/SecretsDialog"
import {
    SikkerhetsmetrikkerSystemTotal,
    RepositorySummary,
} from "../typesFrontend"

export const getAllSecrets = (
    data: SikkerhetsmetrikkerSystemTotal[],
): Secrets[] =>
    data
        .flatMap((s) => s.metrics?.permittedMetrics ?? [])
        .map((r) => ({
            componentName: r.componentName,
            alerts: r.secrets?.alerts ?? [],
        }))
        .filter((s) => s.alerts.length > 0)

export const getAllPermittedMetrics = (
    data: SikkerhetsmetrikkerSystemTotal[],
): RepositorySummary[] => data.flatMap((s) => s.metrics?.permittedMetrics ?? [])

export const getAllNotPermittedComponents = (
    data: SikkerhetsmetrikkerSystemTotal[],
): string[] => data.flatMap((s) => s.metrics?.notPermittedComponents ?? [])

export type NotPermittedInfo = {
    systemName: string
    components: string[]
}

export const getNotPermittedInfo = (
    data: SikkerhetsmetrikkerSystemTotal[],
): NotPermittedInfo[] =>
    data
        .map((s) => ({
            systemName: s.systemName,
            components: s.metrics?.notPermittedComponents ?? [],
        }))
        .filter((s) => s.components.length > 0)

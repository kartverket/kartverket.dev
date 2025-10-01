import { Config } from "@backstage/config"

export type BackendConfig = {
    environment: string
    isUsingMock: boolean
    backendBaseUrl: string
    entraIdConfig: EntraIdConfig
}

export type EntraIdConfig = {
    tenantId: string
    clientId: string
    clientSecret: string
    scope: string
}

export const getBackendConfig = (config: Config): BackendConfig => {
    const environment = config.getString("auth.environment")
    const clientCredentialsConfig = `auth.providers.microsoft.${environment}`
    const securityMetricsConfig = "sikkerhetsmetrikker"
    return {
        environment: environment,
        isUsingMock: !!config.getOptionalBoolean("isUsingMock"),
        backendBaseUrl: config.getString(`${securityMetricsConfig}.baseUrl`),
        entraIdConfig: {
            tenantId: config.getString(`${clientCredentialsConfig}.tenantId`),
            clientId: config.getString(`${clientCredentialsConfig}.clientId`),
            clientSecret: config.getString(
                `${clientCredentialsConfig}.clientSecret`,
            ),
            scope: `${config.getOptionalString(
                `${securityMetricsConfig}.clientId`,
            )}/.default`,
        },
    }
}

import { AuthService, LoggerService } from "@backstage/backend-plugin-api"
import express from "express"
import Router from "express-promise-router"
import { Config } from "@backstage/config"
import { ApiService } from "./api.service"
import { EntraIdService } from "../EntraIdService/auth.service"
import {
    AcceptVulnerabilityRequestBody,
    FetchMetricsRequestBody,
    FetchTrendsRequestBody,
} from "./typesBackend"
import { getBackendConfig } from "../config"

export interface RouterOptions {
    auth: AuthService
    logger: LoggerService
    config: Config
}

const formatToken = (token: string | undefined): string | null => {
    if (!token || !token.startsWith("Bearer")) {
        return null
    }
    return token.substring(7).trim()
}

const validateToken = (
    token: string | undefined,
    auth: AuthService,
): string | null => {
    const formattedToken = formatToken(token)
    if (!formattedToken) {
        return null
    }
    const credentials = auth.authenticate(formattedToken)
    if (!credentials) {
        return null
    }
    return formattedToken
}

export const createRouter = async (
    options: RouterOptions,
): Promise<express.Router> => {
    const { auth, logger, config } = options
    const backendConfig = getBackendConfig(config)

    logger.info("[Router] Creating router with config:", {
        hasAuth: !!auth,
        hasLogger: !!logger,
        hasConfig: !!config,
        backendBaseUrl: backendConfig.backendBaseUrl,
    })

    const entraIdService = new EntraIdService(
        backendConfig.entraIdConfig,
        logger,
    )
    const apiService = new ApiService(
        backendConfig.backendBaseUrl,
        entraIdService,
        logger,
    )

    const router = Router()
    router.use(express.json())

    router.use((req, _, next) => {
        logger.info(`[Router] Incoming request: ${req.method} ${req.path}`, {
            headers: {
                authorization: req.header("Authorization")
                    ? "Bearer [PRESENT]"
                    : "MISSING",
                contentType: req.header("Content-Type"),
                userAgent: req.header("User-Agent"),
            },
            body: {
                hasRepositoryNames: !!req.body?.repositoryNames,
                repositoryNamesLength: req.body?.repositoryNames?.length,
                repositoryNames: req.body?.repositoryNames,
                hasEntraIdToken: !!req.body?.entraIdToken,
                entraIdTokenLength: req.body?.entraIdToken?.length,
            },
        })
        next()
    })

    router.post("/proxy/fetch-security-champions/", async (req, res) => {
        try {
            const backstageToken = req.header("Authorization")
            const validToken = validateToken(backstageToken, auth)
            const request = req.body
            if (!validToken || !backstageToken) {
                res.status(401).send({
                    frontendMessage: "Token is not valid",
                })
            } else {
                const securityChampion =
                    await apiService.fetchSecurityChampionInfo(
                        request.repositoryNames,
                        request.entraIdToken,
                    )
                if (securityChampion.isRight()) {
                    res.status(200).send(securityChampion.value)
                } else {
                    res.status(securityChampion.error.statusCode).send({
                        frontendMessage: securityChampion.error.frontendMessage,
                    })
                    logger.error(securityChampion.error.error)
                }
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error"
            logger.error(`Failed to fetch security champion data: ${error}`)
            res.status(500).send({
                frontendMessage: `Failed to fetch security champion data: ${errorMessage}`,
            })
        }
    })

    router.post("/proxy/fetch-metrics/", async (req, res) => {
        try {
            const backstageToken = req.header("Authorization")
            const validToken = validateToken(backstageToken, auth)
            const request = req.body as FetchMetricsRequestBody
            if (!validToken || !backstageToken) {
                res.status(401).send({
                    frontendMessage: "Token is not valid",
                })
            } else {
                const metricsData = await apiService.fetchMetricsData(
                    request.componentNames,
                    request.entraIdToken,
                )

                if (metricsData.isRight()) {
                    res.status(200).send(metricsData.value)
                } else {
                    res.status(metricsData.error.statusCode).send({
                        frontendMessage: metricsData.error.frontendMessage,
                    })
                    logger.error(metricsData.error.error)
                }
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error"
            logger.error(`Failed to fetch metrics data: ${error}`)
            res.status(500).send({
                frontendMessage: `Failed to fetch metrics data: ${errorMessage}`,
            })
        }
    })

    router.get("/proxy/fetch-component-metrics/", async (req, res) => {
        try {
            const backstageToken = req.header("Authorization")
            const validToken = validateToken(backstageToken, auth)
            const entraIdToken = req.header("EntraId")
            const componentName = req.query.componentName as string | undefined

            if (
                !componentName ||
                !validToken ||
                !backstageToken ||
                !entraIdToken
            ) {
                if (!componentName) {
                    res.status(401).send({
                        frontendMessage:
                            "Missing componentName query parameter",
                    })
                }
                res.status(401).send({
                    frontendMessage: "Token is not valid",
                })
            } else {
                const metricsData = await apiService.fetchComponentMetricsData(
                    componentName,
                    entraIdToken,
                )

                if (metricsData.isRight()) {
                    res.status(200).send(metricsData.value)
                } else {
                    res.status(metricsData.error.statusCode).send({
                        frontendMessage: metricsData.error.frontendMessage,
                    })
                    logger.error(metricsData.error.error)
                }
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error"
            logger.error(`Failed to fetch metrics data: ${error}`)
            res.status(500).send({
                frontendMessage: `Failed to fetch metrics data: ${errorMessage}`,
            })
        }
    })

    router.post("/proxy/fetch-trends/", async (req, res) => {
        try {
            const backstageToken = req.header("Authorization")
            const validToken = validateToken(backstageToken, auth)
            const request = req.body as FetchTrendsRequestBody

            if (!validToken || !backstageToken) {
                res.sendStatus(401).send({
                    frontendMessage: "Token is not valid",
                })
            } else {
                const severityCounts =
                    await apiService.fetchVulnerabilityTrendsData(
                        request.componentNames,
                        request.fromDate,
                        request.toDate,
                        request.entraIdToken,
                    )
                if (severityCounts.isRight()) {
                    res.status(200).send(severityCounts.value)
                } else {
                    res.status(severityCounts.error.statusCode).send({
                        frontendMessage: severityCounts.error.frontendMessage,
                    })
                    logger.error(severityCounts.error.error)
                }
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error"
            logger.error(`Failed to fetch vulnerability trends data: ${error}`)
            res.status(500).send({
                frontendMessage: `Failed to fetch vulnerability trends data: ${errorMessage}`,
            })
        }
    })

    router.post("/proxy/accept-vulnerability/", async (req, res) => {
        try {
            const backstageToken = req.header("Authorization")
            const validToken = validateToken(backstageToken, auth)
            const request = req.body as AcceptVulnerabilityRequestBody

            if (!validToken || !backstageToken) {
                res.status(401).send({ frontendMessage: "Token is not valid" })
                return
            }

            const apiResult = await apiService.acceptVulnerability(
                request.componentName,
                request.vulnerabilityId,
                request.comment,
                request.acceptedBy,
                request.entraIdToken,
            )

            if (apiResult.isRight()) {
                res.sendStatus(204)
            } else {
                res.status(apiResult.error.statusCode).send({
                    frontendMessage: apiResult.error.frontendMessage,
                })
                logger.error(apiResult.error.error)
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error"
            logger.error(`Failed to accept vulnerability: ${error}`)
            throw new Error(errorMessage)
        }
    })

    return router
}

import { useQuery } from "@tanstack/react-query"
import { getAuthenticationTokens } from "../utils/authenticationUtils"
import { MetricTypes } from "../utils/MetricTypes"
import { useConfig } from "./getConfig"
import { TrendSeverityCounts } from "../typesFrontend"
import { post } from "../api/client"

export const useTrendsQuery = (
    componentNames: string[],
    fromDate: Date,
    toDate: Date,
) => {
    const { config, backstageAuthApi, microsoftAuthApi, endpointUrl } =
        useConfig(MetricTypes.trends)

    return useQuery<TrendSeverityCounts[], Error>({
        queryKey: ["trends", [...componentNames], fromDate, toDate],
        queryFn: async () => {
            const { entraIdToken, backstageToken } =
                await getAuthenticationTokens(
                    config,
                    backstageAuthApi,
                    microsoftAuthApi,
                )
            return post<
                {
                    componentNames: string[]
                    fromDate: Date
                    toDate: Date
                    entraIdToken: string
                },
                TrendSeverityCounts[]
            >(endpointUrl, backstageToken, {
                componentNames,
                fromDate,
                toDate,
                entraIdToken,
            })
        },
        staleTime: 3600000,
        refetchOnWindowFocus: false,
        enabled: componentNames.length > 0,
    })
}

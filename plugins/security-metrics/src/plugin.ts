import {
    createPlugin,
    createRoutableExtension,
} from "@backstage/core-plugin-api"

import { rootRouteRef } from "./routes"

export const securityMetricsPlugin = createPlugin({
    id: "security-metrics-frontend",
    routes: {
        root: rootRouteRef,
    },
})

export const SecurityMetricsPage = securityMetricsPlugin.provide(
    createRoutableExtension({
        name: "SecurityMetricsPage",
        component: () => import("./PluginRoot").then((m) => m.PluginRoot),
        mountPoint: rootRouteRef,
    }),
)

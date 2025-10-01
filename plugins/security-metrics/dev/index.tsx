import { createDevApp } from "@backstage/dev-utils"
import { SecurityMetricsPage, securityMetricsPlugin } from "../src/plugin"

createDevApp()
    .registerPlugin(securityMetricsPlugin)
    .addPage({
        element: <SecurityMetricsPage />,
        title: "Root Page",
        path: "/security-metrics",
    })
    .render()

import { securityMetricsPlugin } from "./plugin"

describe("security-metrics", () => {
    it("should export plugin", () => {
        expect(securityMetricsPlugin).toBeDefined()
    })
})

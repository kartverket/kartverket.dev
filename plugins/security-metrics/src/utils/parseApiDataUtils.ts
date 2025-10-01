export function parseScanData(raw: unknown): Record<string, any[]> {
    if (raw && typeof raw === "object" && "constructor" in raw) {
        return raw as Record<string, any[]>
    }
    return {}
}

export function parseVulnCounts(raw: unknown): Record<string, any> {
    if (raw && typeof raw === "object" && "constructor" in raw) {
        return raw as Record<string, any>
    }
    return {}
}

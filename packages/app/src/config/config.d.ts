export interface Config {
    auth: {
        providers: {
            microsoft: {
                development: {
                    /**
                     * Frontend root URL
                     * NOTE: Visibility applies to only this field
                     * @visibility frontend
                     */
                    clientId: string
                }
                production: {
                    /**
                     * Frontend root URL
                     * NOTE: Visibility applies to only this field
                     * @visibility frontend
                     */
                    clientId: string
                }
            }
        }
    }
}
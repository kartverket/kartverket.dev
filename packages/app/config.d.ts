export interface Config {
    auth: {
        providers: {
            /**
             * @visibility frontend
             */
            microsoft: {
                /**
                 * @visibility frontend
                 */
                development: {
                    /**
                     * @visibility frontend
                     */
                    clientId: string;
                };
                /**
                 * @visibility frontend
                 */
                production: {
                    /**
                     * @visibility frontend
                     */
                    clientId: string;
                };
            };
        };
    };
}
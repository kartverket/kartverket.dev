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
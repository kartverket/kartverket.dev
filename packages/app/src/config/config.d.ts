export interface Config {
   auth: {
        providers: {
            /**
             * NOTE: Visibility applies recursively downward
             * @deepVisibility frontend
             */
            microsoft: {
                development: {
                    clientId: string
                }
                production: {
                    clientId: string
                }
            }
        }
    }
}
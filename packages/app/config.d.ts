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
          /**
           * @visibility secret
           */
          clientSecret: string;
        };
        production: {
          /**
           * @visibility frontend
           */
          clientId: string;
          /**
           * @visibility secret
           */
          clientSecret: string;
        };
      };
    };
  };
  regelrett: {
    /**
     * @visibility frontend
     */
    baseUrl: string;
  };
}

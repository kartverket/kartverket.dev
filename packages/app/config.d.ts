export interface Config {
  /**
   * @visibility frontend
   */
  auth: {
    providers: {
      microsoft: {
        development: {
          /**
           * @visibility frontend
           */
          clientId: string;
          /**
           * @visibility frontend
           */
          tenantId: string;
        };
        production: {
          /**
           * @visibility frontend
           */
          clientId: string;
          /**
           * @visibility frontend
           */
          tenantId: string;
        };
      };
    };
  };
}

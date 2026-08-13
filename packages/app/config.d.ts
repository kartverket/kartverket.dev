export interface Config {
  auth: {
    providers: {
      /**
       * @visibility frontend
       */
      microsoft?: {
        /**
         * @visibility frontend
         */
        production?: {
          /**
           * @visibility frontend
           */
          clientId: string;
          /**
           * @visibility secret
           */
          clientSecret: string;
        };
        development?: {
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
    mode: 'disabled' | 'synthetic' | 'connected';
    /**
     * @visibility frontend
     */
    baseUrl?: string;
    /**
     * @visibility frontend
     */
    url?: string;
    authentication?: 'synthetic' | 'entra';
  };
  sikkerhetsmetrikker: {
    /**
     * @visibility frontend
     */
    mode: 'disabled' | 'synthetic' | 'connected';
    authentication?: 'synthetic' | 'entra';
  };
  ros: {
    /**
     * @visibility frontend
     */
    mode: 'disabled' | 'synthetic' | 'connected';
  };
  lighthouse: {
    /**
     * @visibility frontend
     */
    mode: 'disabled' | 'synthetic' | 'connected';
  };
  catalogCreator: {
    /**
     * @visibility frontend
     */
    mode: 'disabled' | 'synthetic' | 'connected';
  };
  securityChampion: {
    /**
     * @visibility frontend
     */
    mode: 'disabled' | 'synthetic' | 'connected';
  };
  opencost: {
    /**
     * @visibility frontend
     */
    mode: 'disabled' | 'synthetic' | 'connected';
  };
}

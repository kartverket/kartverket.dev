import { EntraIdConfiguration } from '../types';
import {
  ConfidentialClientApplication,
  Configuration,
  OnBehalfOfRequest,
} from '@azure/msal-node';
import { LoggerService } from '@backstage/backend-plugin-api';

export class EntraIdService {
  private entraIdConfig: EntraIdConfiguration;
  private clientApplication: ConfidentialClientApplication;

  constructor(entraIdConfig: EntraIdConfiguration) {
    this.entraIdConfig = entraIdConfig;
    const msalConfig: Configuration = {
      auth: {
        clientId: this.entraIdConfig.clientId, // Backstage client ID
        clientSecret: this.entraIdConfig.clientSecret, // Backstage client secret
        authority: `https://login.microsoftonline.com/${this.entraIdConfig.tenantId}`,
      },
    };

    this.clientApplication = new ConfidentialClientApplication(msalConfig);
  }

  async acquireTokenOnBehalfOfUser(token: string) {
    const request: OnBehalfOfRequest = {
      oboAssertion: token, // The assertion is the Token FE
      scopes: [this.entraIdConfig.scope], // <API-A-audience>/.default
    };

    const response =
      await this.clientApplication.acquireTokenOnBehalfOf(request);

    return response?.accessToken; // The output is Token A
  }
}

// This does the OBO flow and the calling
export class ProxyService {
  private readonly baseUrlApiA: string;
  private entraIdService: EntraIdService;

  constructor(baseUrlApiA: string, entraIdService: EntraIdService) {
    this.baseUrlApiA = baseUrlApiA;
    this.entraIdService = entraIdService;
  }

  async getData(
    logger: LoggerService,
    clientToken: string,
    endpoint: string,
  ): Promise<any> {
    const tokenA =
      await this.entraIdService.acquireTokenOnBehalfOfUser(clientToken);

    logger.info(`Proxy made a GET request to ${this.baseUrlApiA}/${endpoint}`);
    if (!tokenA) return null;
    const response = await fetch(`${this.baseUrlApiA}/${endpoint}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      method: 'GET',
    });

    return response.json();
  }
}

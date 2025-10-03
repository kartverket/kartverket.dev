import { IEntraIdService } from '../../contracts/IEntraIdService';
import {
  ConfidentialClientApplication,
  Configuration,
  OnBehalfOfRequest,
} from '@azure/msal-node';
import { LoggerService } from '@backstage/backend-plugin-api';
import { EntraIdConfig } from '../config';

export class EntraIdService implements IEntraIdService {
  private entraIdConfig: EntraIdConfig;
  private azureAdClient: ConfidentialClientApplication;
  private logger: LoggerService;

  constructor(entraIdConfig: EntraIdConfig, logger: LoggerService) {
    this.logger = logger;
    this.entraIdConfig = entraIdConfig;
    const msalConfig: Configuration = {
      auth: {
        clientId: this.entraIdConfig.clientId,
        clientSecret: this.entraIdConfig.clientSecret,
        authority: `https://login.microsoftonline.com/${this.entraIdConfig.tenantId}`,
      },
    };
    this.azureAdClient = new ConfidentialClientApplication(msalConfig);
  }

  async getOboToken(token: string): Promise<string | undefined> {
    try {
      const oboRequest: OnBehalfOfRequest = {
        oboAssertion: token,
        scopes: [this.entraIdConfig.scope],
      };

      const response =
        await this.azureAdClient.acquireTokenOnBehalfOf(oboRequest);

      return response?.accessToken;
    } catch (error) {
      // @ts-ignore
      this.logger.error(error.message);
      throw new Error(
        `OBO Token acquisition failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
}

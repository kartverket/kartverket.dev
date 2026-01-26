import { LoggerService } from '@backstage/backend-plugin-api';
import { EntraIdService } from './entraIdService';
import { ApiError, Context, Result } from '../types';
import { errorHandling } from '../Errors';

export class ProxyApiService {
  private readonly regelrettBaseUrl: string;
  private entraIdService: EntraIdService;
  private logger: LoggerService;

  constructor(
    regelrettBaseUrl: string,
    entraIdService: EntraIdService,
    logger: LoggerService,
  ) {
    this.regelrettBaseUrl = regelrettBaseUrl;
    this.entraIdService = entraIdService;
    this.logger = logger;
  }

  async fetchContextByFunctionName(
    clientToken: string,
    name: string,
  ): Promise<Result<ApiError, Context>> {
    const token = await this.entraIdService.getOboToken(clientToken);
    if (!token) throw new Error(`Failed to fetch token for Regelrett API`);

    try {
      this.logger.info(
        `Proxy made a GET request to ${this.regelrettBaseUrl}/api/name/${name}`,
      );

      const response = await fetch(
        `${this.regelrettBaseUrl}/api/name/${name}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          method: 'GET',
        },
      );

      if (response.ok) {
        const context: Context = await response.json();
        return { ok: true, data: context };
      }
      return { ok: false, error: errorHandling(response) };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to fetch from Regelrett API with the following error: ${error}`,
        );
        throw new Error(
          `Failed to fetch context by function name from Regelrett API with following error: ${error.message}`,
        );
      }
      throw new Error(
        `Failed to fetch context by function name from Regelrett API with an unkown error: ${error}`,
      );
    }
  }
}

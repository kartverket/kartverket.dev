import { LoggerService } from '@backstage/backend-plugin-api';
import { EntraIdService } from './entraIdService';
import { ApiError, Context, ContextWithMetrics, Result, Form } from '../types';
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
  ): Promise<Result<ApiError, ContextWithMetrics>> {
    const token = await this.entraIdService.getOboToken(clientToken);
    if (!token) throw new Error(`Failed to fetch token for Regelrett API`);

    try {
      const url = new URL(`${this.regelrettBaseUrl}/api/contexts/name`);
      url.searchParams.set('name', name);
      url.searchParams.set('includeMetrics', 'true');
      this.logger.info(`Proxy made a GET request to ${url.toString()}`);

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      });

      if (response.ok) {
        const context: ContextWithMetrics = await response.json();
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

  async createRegelrettContext(
    clientToken: string,
    name: string,
    formId: string,
    teamId: string,
  ): Promise<Result<ApiError, Context>> {
    const token = await this.entraIdService.getOboToken(clientToken);
    if (!token) throw new Error(`Failed to fetch token for Regelrett API`);

    try {
      const url = new URL(`${this.regelrettBaseUrl}/api/contexts`);
      url.searchParams.set('name', name);
      this.logger.info(`Proxy made a GET request to ${url.toString()}`);

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          teamId,
          formId,
        }),
        method: 'POST',
      });

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

  async fetchForms(clientToken: string): Promise<Result<ApiError, Form[]>> {
    const token = await this.entraIdService.getOboToken(clientToken);
    if (!token) throw new Error(`Failed to fetch token for Regelrett API`);

    try {
      const url = new URL(`${this.regelrettBaseUrl}/api/forms`);
      this.logger.info(`Proxy made a GET request to ${url.toString()}`);

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      });

      if (response.ok) {
        const forms: Form[] = await response.json();
        return { ok: true, data: forms };
      }
      return { ok: false, error: errorHandling(response) };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to fetch from Regelrett API with the following error: ${error}`,
        );
        throw new Error(
          `Failed to fetch forms from Regelrett API with following error: ${error.message}`,
        );
      }
      throw new Error(
        `Failed to fetch forms from Regelrett API with an unknown error: ${error}`,
      );
    }
  }

  async fetchContextByTeamId(
    clientToken: string,
    teamId: string,
  ): Promise<Result<ApiError, ContextWithMetrics[]>> {
    const token = await this.entraIdService.getOboToken(clientToken);
    if (!token) throw new Error(`Failed to fetch token for Regelrett API`);

    try {
      const url = new URL(`${this.regelrettBaseUrl}/api/contexts`);
      url.searchParams.set('teamId', teamId);
      url.searchParams.set('includeMetrics', 'true');
      this.logger.info(`Proxy made a GET request to ${url.toString()}`);

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
      });

      if (response.ok) {
        const context: ContextWithMetrics[] = await response.json();
        return { ok: true, data: context };
      }
      return { ok: false, error: errorHandling(response) };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to fetch from Regelrett API with the following error: ${error}`,
        );
        throw new Error(
          `Failed to fetch context by team id from Regelrett API with following error: ${error.message}`,
        );
      }
      throw new Error(
        `Failed to fetch context by team id from Regelrett API with an unkown error: ${error}`,
      );
    }
  }
}

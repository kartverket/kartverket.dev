import { LoggerService } from '@backstage/backend-plugin-api';
import { Either, Left, Right } from '../../Either';
import { errorHandling } from '../../Errors';
import { EntraIdService } from '../EntraIdService/auth.service';
import {
  ErrorResponse,
  MetricsUpdateStatus,
  Repository,
  SeverityCounts,
  AggregatedSikkerhetsmetrikker,
  SlackNotificationConfig,
  Status,
  VulnerabilitySeverityCounts,
} from './typesBackend';

export class ApiService {
  private readonly baseUrl: string;
  private readonly upstreamOrigin: string;
  private entraIdService: EntraIdService;
  private logger: LoggerService;

  constructor(
    baseUrl: string,
    entraIdService: EntraIdService,
    logger: LoggerService,
  ) {
    this.baseUrl = baseUrl;
    this.upstreamOrigin = new URL(baseUrl).origin;
    this.entraIdService = entraIdService;
    this.logger = logger;
  }

  private async getSmapiToken(
    entraIdToken: string,
  ): Promise<Either<ErrorResponse, string>> {
    const smapiToken = await this.entraIdService.getOboToken(entraIdToken);

    if (!smapiToken) {
      return Left.create({
        status: 401,
        code: 'TOKEN_FETCH_FAILED',
        message: 'Fikk ikke tak i token for sikkerhetsmetrikker-APIet',
      });
    }

    return Right.create(smapiToken);
  }

  private getAuthorizedHeaders(
    smApiToken: string,
    initHeaders?: HeadersInit,
  ): HeadersInit {
    return {
      Accept: 'application/json',
      Authorization: `Bearer ${smApiToken}`,
      ...(initHeaders ?? {}),
    };
  }

  private buildEndpoint(
    path: string,
    query?: Record<string, string | undefined>,
  ): Either<ErrorResponse, URL> {
    const endpoint = new URL(path, this.baseUrl);

    if (
      endpoint.origin !== this.upstreamOrigin ||
      !(
        [
          '/api/scannerData',
          '/api/oppdateringer/alertsMetadata/status',
          '/api/slack/configure-notifications',
        ].includes(endpoint.pathname) ||
        endpoint.pathname.startsWith('/api/scannerData/')
      )
    ) {
      return Left.create({
        status: 500,
        code: 'INVALID_UPSTREAM_ENDPOINT',
        message: 'Ugyldig upstream-endpoint.',
      });
    }

    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined) {
        endpoint.searchParams.set(key, value);
      }
    });

    return Right.create(endpoint);
  }

  private async request<T>(
    endpoint: URL,
    entraIdToken: string,
    init: RequestInit,
    parseSuccess: (response: Response) => Promise<T>,
    upstreamErrorMessage: string,
  ): Promise<Either<ErrorResponse, T>> {
    const tokenResult = await this.getSmapiToken(entraIdToken);
    if (tokenResult.isLeft()) {
      return Left.create(tokenResult.error);
    }

    try {
      const response = await fetch(endpoint.toString(), {
        ...init,
        headers: this.getAuthorizedHeaders(tokenResult.value, init.headers),
      });

      if (response.ok) {
        return Right.create(await parseSuccess(response));
      }

      return Left.create(await errorHandling(response));
    } catch (error) {
      this.logger.error(
        `Security-metrics API returned error ${error} from endpoint ${endpoint.toString()}`,
      );

      return Left.create({
        status: 503,
        code: 'UPSTREAM_REQUEST_FAILED',
        message: upstreamErrorMessage,
      });
    }
  }

  async fetchMetricsData(
    entityName: string,
    componentNames: string[],
    entraIdToken: string,
  ): Promise<Either<ErrorResponse, AggregatedSikkerhetsmetrikker>> {
    const safeEntityName = encodeURIComponent(entityName);
    const endpointResult = this.buildEndpoint(
      `/api/scannerData/${safeEntityName}`,
    );
    if (endpointResult.isLeft()) {
      return Left.create(endpointResult.error);
    }

    return this.request(
      endpointResult.value,
      entraIdToken,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ componentNames }),
      },
      response => response.json(),
      'Tjenesten for sikkerhetsmetrikker er utilgjengelig akkurat nå. Prøv igjen senere.',
    );
  }

  async fetchComponentMetricsData(
    componentName: string,
    entraIdToken: string,
  ): Promise<Either<ErrorResponse, Repository>> {
    const safeComponentName = encodeURIComponent(componentName);
    const endpointResult = this.buildEndpoint(
      `/api/scannerData/${safeComponentName}`,
    );
    if (endpointResult.isLeft()) {
      return Left.create(endpointResult.error);
    }

    return this.request(
      endpointResult.value,
      entraIdToken,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      response => response.json(),
      'Tjenesten for sikkerhetsmetrikker er utilgjengelig akkurat nå. Prøv igjen senere.',
    );
  }

  async fetchMetricsUpdateStatus(
    entityName: string,
    entraIdToken: string,
  ): Promise<Either<ErrorResponse, MetricsUpdateStatus>> {
    const safeEntityName = encodeURIComponent(entityName);
    const endpointResult = this.buildEndpoint(
      `/api/scannerData/${safeEntityName}/status`,
    );
    if (endpointResult.isLeft()) {
      return Left.create(endpointResult.error);
    }

    return this.request(
      endpointResult.value,
      entraIdToken,
      {
        method: 'GET',
      },
      response => response.json(),
      'Kunne ikke hente oppdateringsstatus fordi tjenesten for sikkerhetsmetrikker er utilgjengelig.',
    );
  }

  async fetchVulnerabilityTrendsData(
    entityName: string,
    componentNames: string[],
    fromDate: Date,
    toDate: Date,
    entraIdToken: string,
  ): Promise<Either<ErrorResponse, SeverityCounts[]>> {
    const safeEntityName = encodeURIComponent(entityName);
    const endpointResult = this.buildEndpoint(
      `/api/scannerData/${safeEntityName}/trends`,
    );
    if (endpointResult.isLeft()) {
      return Left.create(endpointResult.error);
    }

    return this.request(
      endpointResult.value,
      entraIdToken,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          componentNames,
          fromDate,
          toDate,
        }),
      },
      async response => {
        const severityCounts: VulnerabilitySeverityCounts[] =
          await response.json();
        return severityCounts.flatMap(
          repositoryCounts => repositoryCounts.severityCounts,
        );
      },
      'Kunne ikke hente trenddata fordi tjenesten for sikkerhetsmetrikker er utilgjengelig.',
    );
  }

  async changeStatusVulnerability(
    componentName: string,
    vulnerabilityId: string,
    status: Status,
    comment: string | undefined,
    changedBy: string | undefined,
    entraIdToken: string,
  ): Promise<Either<ErrorResponse, void>> {
    const endpointResult = this.buildEndpoint(
      '/api/oppdateringer/alertsMetadata/status',
    );
    if (endpointResult.isLeft()) {
      return Left.create(endpointResult.error);
    }

    return this.request(
      endpointResult.value,
      entraIdToken,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          componentName,
          vulnerabilityId,
          status,
          comment,
          changedBy,
        }),
      },
      async () => undefined,
      'Kunne ikke endre status fordi tjenesten for sikkerhetsmetrikker er utilgjengelig.',
    );
  }

  async configureNotifications(
    teamName: string,
    componentNames: string[],
    channelId: string,
    entraIdToken: string,
    severity?: string[],
  ): Promise<Either<ErrorResponse, void>> {
    const endpointResult = this.buildEndpoint(
      '/api/slack/configure-notifications',
    );
    if (endpointResult.isLeft()) {
      return Left.create(endpointResult.error);
    }

    return this.request(
      endpointResult.value,
      entraIdToken,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamName,
          componentNames,
          channelId,
          severity,
        }),
      },
      async () => undefined,
      'Kunne ikke konfigurere varslinger fordi tjenesten for sikkerhetsmetrikker er utilgjengelig.',
    );
  }

  async getNotificationsConfig(
    teamName: string,
    entraIdToken: string,
  ): Promise<Either<ErrorResponse, SlackNotificationConfig>> {
    const endpointResult = this.buildEndpoint(
      '/api/slack/configure-notifications',
      { teamName },
    );
    if (endpointResult.isLeft()) {
      return Left.create(endpointResult.error);
    }

    return this.request(
      endpointResult.value,
      entraIdToken,
      {
        method: 'GET',
      },
      response => response.json(),
      'Kunne ikke hente konfigurasjon for varslinger fordi tjenesten for sikkerhetsmetrikker er utilgjengelig.',
    );
  }
}

import { EntraIdService } from '../EntraIdService/auth.service';
import {
  Repository,
  SecurityChamp,
  SeverityCounts,
  SikkerhetsmetrikkerSystemTotal,
  VulnerabilitySeverityCounts,
} from './typesBackend';
import { LoggerService } from '@backstage/backend-plugin-api';
import { ApiError, errorHandling, OurOwnErrorMessages } from '../../Errors';
import { Either, Left, Right } from '../../Either';

export class ApiService {
  private readonly baseUrl: string;
  private entraIdService: EntraIdService;
  private logger: LoggerService;

  constructor(
    baseUrl: string,
    entraIdService: EntraIdService,
    logger: LoggerService,
  ) {
    this.baseUrl = baseUrl;
    this.entraIdService = entraIdService;
    this.logger = logger;
  }

  async fetchSecurityChampionInfo(
    repositoryNames: string[],
    entraIdToken: string,
  ): Promise<Either<ApiError, SecurityChamp[]>> {
    const endpointUrl = new URL(`${this.baseUrl}/api/securityChampion`);

    const smapiToken = await this.entraIdService.getOboToken(entraIdToken);

    if (!smapiToken) {
      throw new Error('Failed to fetch token for Security-metrics API');
    }

    try {
      const response = await fetch(`${endpointUrl}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${smapiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repositoryNames: repositoryNames }),
      });

      if (response.ok) {
        const securityChampion: SecurityChamp[] = await response.json();
        return Right.create(securityChampion);
      }
      return errorHandling(response);
    } catch (error) {
      this.logger.error(
        `Security champion API returned error ${error} from endpoint ${endpointUrl}`,
      );
      throw new Error(`Security champion API returned error: ${error}`);
    }
  }

  async fetchMetricsData(
    componentNames: string[],
    entraIdToken: string,
  ): Promise<Either<ApiError, SikkerhetsmetrikkerSystemTotal[]>> {
    const endpointUrl = new URL(`${this.baseUrl}/api/scannerData`);
    const smapiToken = await this.entraIdService.getOboToken(entraIdToken);

    if (!smapiToken) {
      throw new Error('Failed to fetch token for Security-metrics API');
    }

    try {
      const response = await fetch(`${endpointUrl}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${smapiToken}`,
        },
        body: JSON.stringify({ componentNames: componentNames }),
      });

      if (response.ok) {
        const repositories: SikkerhetsmetrikkerSystemTotal[] =
          await response.json();
        return Right.create(repositories);
      }
      return errorHandling(response);
    } catch (error) {
      this.logger.error(
        `Security-metrics API returned error ${error} from endpoint ${endpointUrl}`,
      );
      return Left.create({
        statusCode: 500,
        frontendMessage: OurOwnErrorMessages.UNKNOWN_ERROR,
        error: error,
      });
    }
  }

  async fetchComponentMetricsData(
    componentName: string,
    entraIdToken: string,
  ): Promise<Either<ApiError, Repository>> {
    const endpointUrl = new URL(
      `${this.baseUrl}/api/scannerData/${componentName}`,
    );
    const smapiToken = await this.entraIdService.getOboToken(entraIdToken);

    if (!smapiToken) {
      throw new Error('Failed to fetch token for Security-metrics API');
    }

    try {
      const response = await fetch(`${endpointUrl}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${smapiToken}`,
        },
      });
      if (response.ok) {
        const repository: Repository = await response.json();
        return Right.create(repository);
      }
      return errorHandling(response);
    } catch (error) {
      this.logger.error(
        `Security-metrics API returned error ${error} from endpoint ${endpointUrl}`,
      );
      return Left.create({
        statusCode: 500,
        frontendMessage: OurOwnErrorMessages.UNKNOWN_ERROR,
        error: error,
      });
    }
  }

  async fetchVulnerabilityTrendsData(
    componentNames: string[],
    fromDate: Date,
    toDate: Date,
    entraIdToken: string,
  ): Promise<Either<ApiError, SeverityCounts[]>> {
    const endpointUrl = new URL(`${this.baseUrl}/api/scannerData/trends`);
    const smapiToken = await this.entraIdService.getOboToken(entraIdToken);

    if (!smapiToken) {
      throw new Error('Failed to fetch token for Security-metrics API');
    }

    try {
      const response = await fetch(`${endpointUrl}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${smapiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          componentNames: componentNames,
          fromDate: fromDate,
          toDate: toDate,
        }),
      });

      if (response.ok) {
        const severityCounts: VulnerabilitySeverityCounts[] =
          await response.json();
        return Right.create(
          severityCounts.flatMap(
            repositoryCounts => repositoryCounts.severityCounts,
          ),
        );
      }
      return errorHandling(response);
    } catch (error) {
      this.logger.error(
        `Security-metrics API returned error ${error} from endpoint ${endpointUrl}`,
      );
      return Left.create({
        statusCode: 500,
        frontendMessage: OurOwnErrorMessages.UNKNOWN_ERROR,
        error: error,
      });
    }
  }

  async acceptVulnerability(
    componentName: string,
    vulnerabilityId: string,
    comment: string | undefined,
    acceptedBy: string | undefined,
    entraIdToken: string,
  ): Promise<Either<ApiError, void>> {
    const endpointUrl = `${this.baseUrl}/api/oppdateringer/alertsMetadata/accept`;
    const smapiToken = await this.entraIdService.getOboToken(entraIdToken);

    if (!smapiToken) {
      throw new Error('Failed to fetch token for Security-metrics API');
    }

    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${smapiToken}`,
        },
        body: JSON.stringify({
          componentName,
          vulnerabilityId,
          comment,
          acceptedBy,
        }),
      });

      if (response.status === 204) {
        return Right.create(undefined);
      }
      return errorHandling(response);
    } catch (error) {
      this.logger.error(
        `Security-metrics API returned error ${error} from endpoint ${endpointUrl}`,
      );
      return Left.create({
        statusCode: 500,
        frontendMessage: OurOwnErrorMessages.UNKNOWN_ERROR,
        error,
      });
    }
  }
}

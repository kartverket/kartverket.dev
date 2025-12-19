import { EntraIdService } from '../EntraService/auth.service';

export class ApiService {
  private readonly baseUrl: string;
  private entraIdService: EntraIdService;

  constructor(baseUrl: string, entraIdService: EntraIdService) {
    this.baseUrl = baseUrl;
    this.entraIdService = entraIdService;
  }

  async fetchRegelrettSchema(schemaId: string, entraIdToken: string) {
    const endpointUrl = new URL(`${this.baseUrl}/api/contexts/${schemaId}`);

    const accessToken = await this.entraIdService.getOboToken(entraIdToken);

    if (!accessToken) {
      throw new Error('Failed to fetch token for Security-metrics API');
    }

    try {
      const response = await fetch(`${endpointUrl}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const regelrettSchema: string = await response.json();
        return regelrettSchema;
      }
      throw new Error(`API request failed with response: ${response}`);
    } catch (error) {
      throw new Error(`Security champion API returned error: ${error}`);
    }
  }
}

export interface IEntraIdService {
  getOboToken(token: string): Promise<string | undefined>;
}

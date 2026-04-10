import { ErrorResponse } from '../typesFrontend';

class ApiClientError extends Error {
  status: number;
  code: string;

  constructor(error: ErrorResponse) {
    super(error.message);
    this.name = 'ApiClientError';
    this.status = error.status;
    this.code = error.code;
  }
}

const FALLBACK_ERROR_MESSAGES: Record<number, string> = {
  401: 'Mangler autentisering. Vennligst logg inn.',
  403: 'Du har ikke tilgang til sikkerhetsmetrikker for denne komponenten.',
  404: 'Sikkerhetsmetrikker for denne komponenten er ikke tilgjengelige ennå.',
  409: 'Sikkerhetsmetrikker for denne komponenten er ikke klare ennå.',
  500: 'Noe gikk galt ved henting av sikkerhetsmetrikker.',
  502: 'Tjenesten for sikkerhetsmetrikker er midlertidig utilgjengelig.',
  503: 'Tjenesten for sikkerhetsmetrikker er midlertidig utilgjengelig.',
  504: 'Tjenesten for sikkerhetsmetrikker svarte ikke.',
};

const DEFAULT_ERROR_MESSAGE =
  'Kunne ikke hente metrikker for denne ressursen på grunn av en ukjent feil.';

const isErrorResponse = (value: unknown): value is ErrorResponse => {
  if (!value || typeof value !== 'object') return false;

  const error = value as Record<string, unknown>;
  return (
    typeof error.status === 'number' &&
    typeof error.code === 'string' &&
    typeof error.message === 'string'
  );
};

const toFallbackError = (response: Response): ErrorResponse => ({
  status: response.status,
  code: 'UNKNOWN_ERROR',
  message: FALLBACK_ERROR_MESSAGES[response.status] ?? DEFAULT_ERROR_MESSAGE,
});

const handleResponse = async <ResponseBody>(
  response: Response,
  parse: (response: Response) => Promise<unknown>,
): Promise<ResponseBody> => {
  const result = await parse(response);

  if (!response.ok) {
    if (isErrorResponse(result)) {
      throw new ApiClientError(result);
    }

    if (typeof result === 'string' && result.trim()) {
      throw new ApiClientError({
        status: response.status,
        code: 'UNKNOWN_ERROR',
        message: result.trim(),
      });
    }

    throw new ApiClientError(toFallbackError(response));
  }

  return result as ResponseBody;
};

export const post = async <RequestBody, ResponseBody>(
  url: URL,
  backstageToken: string,
  requestBody: RequestBody,
): Promise<ResponseBody> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${backstageToken}`,
    },
    body: JSON.stringify(requestBody),
  });

  return handleResponse<ResponseBody>(response, async res => {
    if (res.status === 204) return undefined;

    const ct = res.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) return res.json();

    return res.text();
  });
};

export const put = async <RequestBody, ResponseBody>(
  url: URL,
  backstageToken: string,
  requestBody: RequestBody,
): Promise<ResponseBody> => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${backstageToken}`,
    },
    body: JSON.stringify(requestBody),
  });

  return handleResponse<ResponseBody>(response, async res => {
    if (res.status === 204) return undefined;

    const ct = res.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) return res.json();

    return res.text();
  });
};

export const get = async <ResponseBody>(
  url: URL,
  backstageToken: string,
  entraIdToken: string,
): Promise<ResponseBody> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${backstageToken}`,
      EntraId: entraIdToken,
    },
  });

  return handleResponse<ResponseBody>(response, async res => {
    if (res.status === 204) return undefined;

    const ct = res.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) return res.json();

    return res.text();
  });
};

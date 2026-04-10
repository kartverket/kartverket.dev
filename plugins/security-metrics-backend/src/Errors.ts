import { ErrorBody, ErrorResponse } from './services/ApiService/typesBackend';

export async function errorHandling(
  response: Response,
): Promise<ErrorResponse> {
  let errorBody: ErrorBody | undefined;

  try {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      errorBody = (await response.json()) as ErrorBody;
    } else {
      const text = await response.text();
      errorBody = text ? { message: text } : undefined;
    }
  } catch {
    errorBody = undefined;
  }

  return {
    status: errorBody?.status ?? response.status,
    code: errorBody?.code ?? 'UNKNOWN_ERROR',
    message:
      errorBody?.message ??
      'Vi har fått en API-feil som vi ikke har håndtert enda',
  };
}

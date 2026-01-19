const ERROR_MESSAGES: Record<number, string> = {
  401: 'Mangler autentisering. Vennligst logg inn.',
  403: 'Det ser ut som du ikke har tilgang til metrikker for denne ressursen.',
  404: 'Vi fant ikke ressursen du leter etter.',
  500: 'Kunne ikke hente metrikker for denne ressursen på grunn av en server-feil.',
  502: 'Kunne ikke hente metrikker for denne ressursen på grunn av en server-feil.',
  503: 'Kunne ikke hente metrikker for denne ressursen på grunn av en server-feil.',
  504: 'Kunne ikke hente metrikker for denne ressursen på grunn av en server-feil.',
};

const DEFAULT_ERROR_MESSAGE =
  'Kunne ikke hente metrikker for denne ressursen på grunn av en ukjent feil.';

const throwHttpError = (response: Response): never => {
  const message = ERROR_MESSAGES[response.status] ?? DEFAULT_ERROR_MESSAGE;
  throw new Error(message);
};

const handleResponse = async <ResponseBody>(
  response: Response,
  parse: (response: Response) => Promise<ResponseBody>,
): Promise<ResponseBody> => {
  const result = await parse(response);

  if (!response.ok) {
    throwHttpError(response);
  }

  return result;
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

  return handleResponse<ResponseBody>(response, async res =>
    res.status === 204 ? (res.text() as unknown as ResponseBody) : res.json(),
  );
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
    if (res.status === 204) return undefined as unknown as ResponseBody;

    const ct = res.headers.get('content-type') ?? '';
    if (ct.includes('application/json'))
      return (await res.json()) as ResponseBody;

    const text = await res.text();
    return text as unknown as ResponseBody;
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

  return handleResponse<ResponseBody>(response, res => res.json());
};

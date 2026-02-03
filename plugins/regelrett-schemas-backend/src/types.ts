export type EntraIdConfiguration = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  scope: string;
};

export type Context = {
  id: string;
  teamId: string;
  formId: string;
  name: string;
};

export type ApiError = {
  statusCode: number;
  message?: string;
};

export type Result<ErrorType, DataType> = Err<ErrorType> | Ok<DataType>;

type Err<E> = { ok: false; error: E };
type Ok<T> = { ok: true; data: T };

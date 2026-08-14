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

export type ContextWithMetrics = Context & {
  answeredCount: number;
  expiredCount: number;
  totalCount: number;
};

export type RegelrettRequestIdentity = {
  entraIdToken?: string;
  userEntityRef: string;
  ownershipEntityRefs: string[];
};

export type Form = {
  id: string;
  name: string;
};

export type ApiError = {
  statusCode: number;
  message?: string;
};

export type Result<ErrorType, DataType> = Err<ErrorType> | Ok<DataType>;

export interface RegelrettService {
  fetchContextByFunctionName(
    identity: RegelrettRequestIdentity,
    name: string,
  ): Promise<Result<ApiError, ContextWithMetrics[]>>;
  createRegelrettContext(
    identity: RegelrettRequestIdentity,
    name: string,
    formId: string,
    teamId: string,
  ): Promise<Result<ApiError, Context>>;
  fetchForms(
    identity: RegelrettRequestIdentity,
  ): Promise<Result<ApiError, Form[]>>;
  fetchContextByTeamId(
    identity: RegelrettRequestIdentity,
    teamId: string,
  ): Promise<Result<ApiError, ContextWithMetrics[]>>;
}

type Err<E> = { ok: false; error: E };
type Ok<T> = { ok: true; data: T };

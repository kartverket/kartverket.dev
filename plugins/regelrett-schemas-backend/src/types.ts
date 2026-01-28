export type EntraIdConfiguration = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  scope: string;
};

export type ContextResponse = {
  id: string;
  teamId: string;
  formId: string;
  name: string;
};

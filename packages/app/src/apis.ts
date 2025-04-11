import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  storageApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { VisitsStorageApi, visitsApiRef } from '@backstage/plugin-home';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  createApiFactory({
    api: visitsApiRef,
    deps: {
      storageApi: storageApiRef,
      identityApi: identityApiRef,
    },
    factory: ({ storageApi, identityApi }) =>
      VisitsStorageApi.create({ storageApi, identityApi }),
  }),
  ScmAuth.createDefaultApiFactory(),
];

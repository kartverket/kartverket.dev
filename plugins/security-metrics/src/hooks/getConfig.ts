import {
  useApi,
  configApiRef,
  identityApiRef,
  microsoftAuthApiRef,
  BackstageIdentityApi,
  IdentityApi,
  OAuthApi,
  OpenIdConnectApi,
  ProfileInfoApi,
  SessionApi,
} from '@backstage/core-plugin-api';
import { MetricTypes } from '../utils/MetricTypes';
import { Config } from '@backstage/config';

type UseConfigReturn = {
  config: Config;
  backstageAuthApi: IdentityApi;
  microsoftAuthApi: OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi;
  backendUrl: string;
  endpointUrl: URL;
};

export const useConfig = (type: MetricTypes): UseConfigReturn => {
  const config = useApi(configApiRef);
  const backstageAuthApi = useApi(identityApiRef);
  const microsoftAuthApi = useApi(microsoftAuthApiRef);
  const backendUrl = config.getString('backend.baseUrl');

  const endpointUrl = new URL(
    type === MetricTypes.changeStatusVulnerability ||
    type === MetricTypes.configureNotifications
      ? `${backendUrl}/api/security-metrics/proxy/${type}`
      : `${backendUrl}/api/security-metrics/proxy/fetch-${type}`,
  );
  return {
    config,
    backstageAuthApi,
    microsoftAuthApi,
    backendUrl,
    endpointUrl,
  };
};

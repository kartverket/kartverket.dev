import {
  useApi,
  configApiRef,
  identityApiRef,
  microsoftAuthApiRef,
} from '@backstage/core-plugin-api';
import { MetricTypes } from '../utils/MetricTypes';

export const useConfig = (type: MetricTypes) => {
  const config = useApi(configApiRef);
  const backstageAuthApi = useApi(identityApiRef);
  const microsoftAuthApi = useApi(microsoftAuthApiRef);
  const backendUrl = config.getString('backend.baseUrl');

  const endpointUrl = new URL(
    type === MetricTypes.acceptVulnerability
      ? `${backendUrl}/api/security-metrics/proxy/accept-vulnerability`
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

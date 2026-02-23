import { useQuery } from '@tanstack/react-query';
import { useConfig } from './getConfig';
import { MetricTypes } from '../utils/MetricTypes';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import { get } from '../api/client';

export type SlackNotificationConfig = {
  teamName: string;
  channelId: string;
  componentNames: string[];
  severity: string[];
};

export const useSlackNotificationsConfigQuery = (
  teamName: string,
  enabled = true,
) => {
  const { config, backstageAuthApi, microsoftAuthApi, endpointUrl } = useConfig(
    MetricTypes.configureNotifications,
  );

  return useQuery<SlackNotificationConfig | null>({
    queryKey: ['slackNotificationsConfig', teamName],
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );
      const url = new URL(endpointUrl);
      url.searchParams.set('teamName', teamName);

      try {
        return await get<SlackNotificationConfig>(
          url,
          backstageToken,
          entraIdToken,
        );
      } catch (e: any) {
        if (e?.status === 404) return null;
        throw e;
      }
    },
    enabled: !!teamName && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

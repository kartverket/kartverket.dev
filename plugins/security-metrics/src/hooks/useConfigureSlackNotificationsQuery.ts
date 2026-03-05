import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useConfig } from './getConfig';
import { MetricTypes } from '../utils/MetricTypes';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import { put } from '../api/client';

type SlackNotificationPayload = {
  teamName: string;
  channelId: string;
  componentNames: string[];
  severity?: string[];
};

export const useConfigureSlackNotificationsQuery = () => {
  const { config, backstageAuthApi, microsoftAuthApi, endpointUrl } = useConfig(
    MetricTypes.configureNotifications,
  );

  const qc = useQueryClient();

  return useMutation<any, Error, SlackNotificationPayload>({
    mutationFn: async ({ teamName, componentNames, channelId, severity }) => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );
      try {
        return await put<
          {
            teamName: string;
            componentNames: string[];
            channelId: string;
            entraIdToken: string;
            severity?: string[];
          },
          any
        >(endpointUrl, backstageToken, {
          teamName,
          componentNames,
          channelId,
          entraIdToken,
          severity,
        });
      } catch (e) {
        const INVALID_CHANNEL_PREFIX = 'Invalid Slack channel: ';
        if (
          e instanceof Error &&
          e.message.startsWith(INVALID_CHANNEL_PREFIX)
        ) {
          const code = e.message.slice(INVALID_CHANNEL_PREFIX.length);
          throw new Error(`Ugyldig Slack-kanal: ${code}`);
        }
        throw e;
      }
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ['slackNotificationsConfig', vars.teamName],
      });
    },
  });
};

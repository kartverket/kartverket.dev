import { TaskScheduleDefinition } from '@backstage/backend-tasks';
import { createRouter } from '@backstage/plugin-linguist-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

export default async function createPlugin(
    env: PluginEnvironment,
): Promise<Router> {
    const schedule: TaskScheduleDefinition = {
        frequency: { minutes: 2 },
        timeout: { minutes: 15 },
        initialDelay: { seconds: 90 },
    };

    return createRouter({ schedule: schedule }, { ...env });
}

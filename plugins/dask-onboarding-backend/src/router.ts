import express, { Request } from 'express';
import Router from 'express-promise-router';
import { Firestore } from '@google-cloud/firestore';
import { PubSub } from '@google-cloud/pubsub';
import { jwtDecode } from 'jwt-decode';

import { GcpConfig, TeamDoc } from './types';

/**
 * We still connect to Firestore/PubSub as before, just removing references to `@backstage/backend-common`.
 */
const firestore = new Firestore({
  projectId: process.env.DASK_GCP_PROJECT_ID,
});
const pubsub = new PubSub({
  projectId: process.env.DASK_GCP_PROJECT_ID,
});

const topicId = 'onboarding_topic';

/** A Firestore converter, unchanged from before */
const converter = {
  toFirestore: (data: TeamDoc) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as TeamDoc,
};

/** Publish messages to PubSub (unchanged from before) */
async function publishMessage(data: string) {
  const dataBuffer = Buffer.from(data);

  try {
    const messageId = await pubsub.topic(topicId).publishMessage({ data: dataBuffer });
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error}`);
  }
}

/** Minimal shape of the JWT "groups" claim used for team/area checking */
type UserGroupsRaw = {
  groups: string[];
};

/** Decode token using `jwt-decode` */
function decodeToken(token: string): UserGroupsRaw | null {
  try {
    console.log(jwtDecode)
    console.log(jwtDecode)
    return jwtDecode<UserGroupsRaw>(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}

/** Extract all team info from the token */
function getGroupsFromToken(token: string) {
  const decoded = decodeToken(token);
  if (!decoded?.groups) {
    return [];
  }

  // In your code, a "group" might look like "area:team"
  // e.g. "Plattform:my-team - Team Lead". Adjust as needed.
  return decoded.groups.map(group => {
    const [area, team] = group.split(':');
    return { area, team };
  });
}

/** Helper to just get the team names from the token */
function getTeamsFromToken(token: string) {
  return getGroupsFromToken(token)
    .map(({ team }) => team)
    // example filter: remove team roles suffix if you want
    .filter(t => !/( - Team Lead| - Tech Lead| - Product Owner)$/.test(t));
}

/** Helper to get areas from token, if relevant */
function getAreasFromToken(token: string) {
  return getGroupsFromToken(token).map(({ area }) => area);
}

export async function createRouter({}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  router.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  
  router.post(
    '/onboarding/start',
    async (req: Request<any, any, { team: string; areaName: string; projectName: string }>, res) => {
      const teamsInToken = getTeamsFromToken(req.headers.authorization || '');
      const hasAccessToTeam = teamsInToken.includes(req.body.team);

      if (!hasAccessToTeam) {
        return res.status(403).send();
      }

      // Publish a message to PubSub with the step
      await publishMessage(
        JSON.stringify({
          step: 'start',
          team_name: req.body.team,
          params: {
            area_name: req.body.areaName,
            project_name: req.body.projectName,
          },
        }),
      );

      return res.status(204).send();
    },
  );

  // Example route: PUT /onboarding/gcp-config
  router.put(
    '/onboarding/gcp-config',
    async (req: Request<any, any, {
      team: string;
      areaName: string;
      projectName: string;
      projectIds: GcpConfig;
      authNumbers: GcpConfig;
    }>,
    res,
    ) => {
      const teamsInToken = getTeamsFromToken(req.headers.authorization || '');
      const hasAccessToTeam = teamsInToken.includes(req.body.team);

      if (!hasAccessToTeam) {
        return res.status(403).send();
      }

      await publishMessage(
        JSON.stringify({
          step: 'iam-setup',
          team_name: req.body.team,
          params: {
            team_name: req.body.team,
            area_name: req.body.areaName,
            project_name: req.body.projectName,
            ad_groups: [req.body.team],
            gcp_project_ids: req.body.projectIds,
            gcp_auth_numbers: req.body.authNumbers,
          },
        }),
      );

      return res.status(204).send();
    },
  );

  // Example route: PUT /onboarding/gcp-state-buckets
  router.put(
    '/onboarding/gcp-state-buckets',
    async (req: Request<any, any, {
      team: string;
      areaName: string;
      projectName: string;
      stateBuckets: GcpConfig;
      gitTeamName: string;
    }>,
    res,
    ) => {
      const teamsInToken = getTeamsFromToken(req.headers.authorization || '');
      const hasAccessToTeam = teamsInToken.includes(req.body.team);

      // Fetch existing doc from Firestore for the team
      const collection = firestore.collection('onboarding').withConverter(converter);
      const teamDoc = (await collection.doc(req.body.team).get()).data();
      const projectIds = teamDoc?.gcp_project_ids;
      const authNumbers = teamDoc?.gcp_auth_numbers;

      if (!hasAccessToTeam) {
        return res.status(403).send();
      }

      await publishMessage(
        JSON.stringify({
          step: 'gcp-service-accounts-setup',
          team_name: req.body.team,
          params: {
            team_name: req.body.team,
            area_name: req.body.areaName,
            project_name: req.body.projectName,
            ad_groups: [req.body.team],
            gcp_project_ids: projectIds,
            gcp_auth_numbers: authNumbers,
            gcp_state_buckets: req.body.stateBuckets,
            git_team_name: req.body.gitTeamName,
          },
        }),
      );

      return res.status(204).send();
    },
  );

  // Example route: GET /teams
  router.get('/teams', async (req, res) => {
    // Example usage: decode user from headers
    const areasInToken = getAreasFromToken(req.headers.authorization || '');
    const teamsInToken = getTeamsFromToken(req.headers.authorization || '');

    try {
      const collection = firestore.collection('onboarding').withConverter(converter);
      // Firestore doesn't allow an empty array "in" filter, so watch out for that corner case
      if (teamsInToken.length === 0) {
        return res.send({
          ready: [],
          inProgress: [],
          done: [],
          areas: areasInToken,
        });
      }

      const teamsQuery = collection.where('__name__', 'in', teamsInToken);
      const teamsDocs = await teamsQuery.get();
      const teams = teamsDocs.docs.map(doc => doc.data());

      // Identify teams that haven't been onboarded yet
      const teamsReadyToBeOnboarded = teamsInToken
        .filter(teamName => !teams.some(t => t.name === teamName))
        .map(val => ({ name: val, last_status: undefined, statuses: [] }));

      // Example logic for "inProgress" vs "done"
      const teamsInProgress = teams.filter(
        t => !(t.last_status.status === 'done' && t.last_status.step === 'configure-ingestor'),
      );
      const teamsDone = teams.filter(
        t => t.last_status.status === 'done' && t.last_status.step === 'configure-ingestor',
      );

      return res.send({
        ready: teamsReadyToBeOnboarded,
        inProgress: teamsInProgress,
        done: teamsDone,
        areas: areasInToken,
      });
    } catch (error) {
      console.error('Failed to get teams from Firestore collection:', error);
      return res.status(500).send();
    }
  });

  return router;
}

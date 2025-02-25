import { GcpConfig, TeamDoc } from "./types";

function getBaseUrl() {
  if (window.location.origin.includes('localhost')) {
    return 'http://localhost:7007/api/dask-onboarding-backend';
  } else {
    return window.location.origin + '/api/dask-onboarding-backend';
  }
}

const baseUrl = getBaseUrl();

type TeamsRes = { ready: TeamDoc[]; inProgress: TeamDoc[]; done: TeamDoc[], areas: string[] };

async function makeRequest(path: string, method: "GET" | "PUT" | "POST",  token: string, body?: object): Promise<any> {
  const slicedPath = path.startsWith("/") ? path.slice(1) : path;
  const res = await fetch(`${baseUrl}/${slicedPath}`, {
    method: method,
    body: body ? JSON.stringify(body) : null,
    headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" }
  });
  return method === "GET" ? res.json() : { success: res.status === 200 || res.status === 204 };
}

export class OnboardingClient {
  static async getTeams(token: string): Promise<TeamsRes> {
    const res = await makeRequest("/teams", "GET", token) as TeamsRes;
    return res;
  }

  static async updateDataIngestor(token: string, teamName: string, areaName: string, projectName: string, stateBuckets: GcpConfig, gitTeamName: string) {
    makeRequest("/onboarding/gcp-state-buckets", "PUT", token, { team: teamName, areaName, projectName, stateBuckets, gitTeamName })
  }

  static async updateGcpConfig(token: string, teamName: string, areaName: string, projectName: string, projectIds: GcpConfig, authNumbers: GcpConfig) {
    makeRequest("/onboarding/gcp-config", "PUT", token, { team: teamName, areaName, projectName, projectIds, authNumbers })
  }

  static async startOnboarding(token: string, teamName: string, areaName: string, projectName: string) {
    makeRequest("/onboarding/start", "POST", token, { team: teamName, areaName, projectName })
  }
}

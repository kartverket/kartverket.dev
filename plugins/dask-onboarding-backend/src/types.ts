export type Status = "ready" | "in-progress" | "done";

export type TeamStatus = {
    teamId: string;
    teamName: string;
    areaName: "Sjo" | "Eiendom" | "Geodesi" | "Plattform" | "Land";
    status: Status;
}

export type TokenDict = {
    sub: string;
    ent: string[];
    aud: string;
    iat: number;
    exp: number;
}

export type Step = {
    last_updated: string;
    status: Status;
    step: "start" | "setup-ingestor" | "iam-setup" | "gcp-service-accounts-setup" | "dask-infrastructure-setup" | "configure-ingestor";
}

export type TeamDoc = {
    name: string;
    last_status: Step;
    statuses: Step[];
    gcp_project_ids?: GcpConfig;
    gcp_auth_numbers?: GcpConfig;
    gcp_state_buckets?: GcpConfig;
}

export type GcpConfig = {
    sandbox: string;
    dev: string;
    prod: string;
}


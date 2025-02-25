export type Env = "sandbox" | "dev" | "prod";
export type StepStatus = "todo" | "manual-intervention" | "in-progress" | "done";
export type Step = "start" | "setup-ingestor" | "iam-setup" | "gcp-service-accounts-setup" | "dask-infrastructure-setup" | "configure-ingestor";

export type PullRequest = {
    "iam-setup"?: string;
    "gcp-service-accounts-setup"?: string; 
    "dask-infrastructure-setup"?: string;
    "configure-ingestor"?: string;
};

export type Status = {
    last_updated: string;
    status: StepStatus;
    step: Step;
}

export type TeamDoc = {
    name: string;
    area_name: string;
    project_name: string;
    last_status: Status;
    statuses: Status[];
    pr: PullRequest;    
    gcp_project_ids?: GcpConfig;
    gcp_auth_numbers?: GcpConfig;
    gcp_state_buckets?: GcpConfig;
}

export type GcpConfig = {
    sandbox: string;
    dev: string;
    prod: string;
};

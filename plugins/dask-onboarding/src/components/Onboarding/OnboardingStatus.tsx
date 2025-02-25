import React, { useState } from "react";
import styled from "styled-components";
import { Content, Spinner, h2Style, h3Style } from "../../common/CommonStyled";
import KvCheckMinimal from "../../common/KvCheckMinimal";
import KvTodo from "../../common/KvTodo";
import gcpProjectImg from "../../common/gcp_projects.png";
import projectIdsImg from "../../common/project_ids.png";
import stateBucketImg from "../../common/state_bucket.png";
import { TeamDoc, Step, Env, GcpConfig, PullRequest } from "../../types";
import { useParams } from "react-router-dom";
import { statusTitleMap } from "./OnboardingStatusBar";
import InputsForEnvs, { Input } from "../../common/InputsForEnvs";
import { Button } from "@material-ui/core";
import { OnboardingClient } from "../../backendClient";

interface IProps {
  teams: TeamDoc[];
  token: string;
}

function isNumber(number: any): boolean {
  return !isNaN(number);
}

function isProjectNumber(input: string): boolean {
  return isNumber(Number(input));
}

function isProjectId(input: string, env: string): boolean {
  const splitProjectId = input.split("-");
  return splitProjectId.at(-1)?.length === 4 && splitProjectId.at(-2) === env;
}

export default function OnboardingStatus({ teams, token }: IProps) {
  const params = useParams();
  const team = teams.find((val) => val.name === params.teamId);
  const lastStatus = team?.last_status;
  if(!team) return null;

  if (!lastStatus) {
    return (
      <Content>
        <div style={{ marginTop: 20 }}>
          <Spinner />
        </div>
      </Content>
    );
  }

  if (lastStatus.step === "iam-setup" && lastStatus.status === "manual-intervention") {
    const team_pr = team.pr?.["iam-setup"] === undefined ? "" : team.pr["iam-setup"];
    return <ManualInputTeamConfig name={team.name} areaName={team.area_name} projectName={team.project_name} pullRequestUrl={team_pr} token={token} />;
  }

  if (lastStatus.step === "gcp-service-accounts-setup" && lastStatus.status === "manual-intervention") {
    const team_pr = team.pr?.["gcp-service-accounts-setup"] === undefined ? "" : team.pr["gcp-service-accounts-setup"];
    return <ManualInputDataIngestor name={team.name} areaName={team.area_name} projectName={team.project_name} pullRequestUrl={team_pr} token={token}/>;
  }
  const currentStatus = team.last_status?.step;
  const pullRequestUrl = currentStatus && team.pr ? team.pr[currentStatus as keyof PullRequest] : undefined;

  return (
    <Content>
      <h2 style={h2Style}>{statusTitleMap[lastStatus.step]}</h2>
      {pullRequestUrl &&
              <p style={{fontSize: 16}}>
              For å følge med på status på deres PR, se{" "}
              <a style={{ textDecoration: "underline" }} href={pullRequestUrl} target="_blank">
                her.
              </a>
            </p>
        }
      <h3 style={h3Style}>Hva skjer i dette steget?</h3>
      {stepsInStepMap[lastStatus.step].map((stepDescription, idx) => (
        <RowFrame key={idx}>
          <IconFrame style={{ width: 20 }}>{lastStatus.status === "done" ? <KvCheckMinimal /> : <KvTodo />}</IconFrame>
          <StatusTitle>{stepDescription}</StatusTitle>
        </RowFrame>
      ))}
      <p style={{fontSize: 16}}>
        Status på workflows kan du finne{" "}
        <a style={{ textDecoration: "underline" }} href={"https://github.com/kartverket/dask-modules/actions"} target="_blank">
          her
        </a>
      </p>
    </Content>
  );
}

function ManualInputDataIngestor({
  name,
  areaName,
  projectName,
  pullRequestUrl,
  token
}: {
  name: string;
  areaName: string;
  projectName: string;
  pullRequestUrl: string;
  token: string;
}) {
  const [isSending, setIsSending] = useState(false);
  const [stateBuckets, setStateBuckets] = useState<GcpConfig>({ sandbox: "", dev: "", prod: "" });
  const [gitTeamName, setGitTeamName] = useState<string>("");

  async function setConfig() {
    setIsSending(true);
    await OnboardingClient.updateDataIngestor(token, name, areaName, projectName, stateBuckets, gitTeamName);
  }

  function onChange(env: Env, val: string, state: GcpConfig, setState: (v: GcpConfig) => void) {
    const newState = { ...state };
    newState[env] = val;
    setState(newState);
  }

  return (
    <Content>
      <h2 style={h2Style}>Konfigurasjon av Terraform State Buckets</h2>
      <p style={{ fontSize: 16 }}>
        Nå som det er blitt laget maskinbrukere for teamet i deres nye prosjekt, har man i tillegg opprettet "state
        buckets" for teamet. Når man jobber med Terraform er det viktig å ha en måte å lagre infrastrukturens state på,
        og det er dette disse bøttene skal hjelpe oss med.
      </p>
      <p style={{fontSize: 16}}>
        Disse variablene har dere kun tilgjengelig om SKIP/DASK har godkjent PR-en som ble opprettet i forrige steg. For å følge med på status på deres PR i GCP-oppsettet se{" "}
        <a style={{ textDecoration: "underline" }} href={pullRequestUrl} target="_blank">
          her.
        </a>
      </p>
      <h3 style={{ ...h3Style, marginTop: 30 }}>Legg inn state bucket IDer fra GCP</h3>
      <InputsForEnvs onChange={(env, val) => onChange(env, val, stateBuckets, setStateBuckets)} />
      <h3 style={{ ...h3Style, marginTop: 30 }}>Legg inn navn på teamet i GitHub (se oversikt over teams{" "}
        <a style={{ textDecoration: "underline" }} href="https://github.com/orgs/kartverket/teams" target="_blank">
          her
        </a>
        )
      </h3>
      <Input type="text" value={gitTeamName} onChange={(e) => setGitTeamName(e.target.value)} isdark={false} />

      {isSending ? (
        <div style={{ marginTop: 20 }}>
          <Spinner />
        </div>
      ) : (
        <Button key={"submit-state-buckets"} onClick={setConfig} variant="outlined" type="button">
          Send inn
        </Button>
      )}
      <h2 style={h2Style}>Hvordan finner jeg navn på Terraform state buckets?</h2>
      <ol>
        <li style={{fontSize: 20}}>Logg inn i Google-konsollen {" "}
          <a style={{ textDecoration: "underline" }} href="https://console.cloud.google.com/">her</a></li>
          <li style={{fontSize: 20}}>Velg et av prosjektene dine i venstre hjørne</li>
          <img src={gcpProjectImg} style={{width: 300, marginTop: 20, marginBottom: 20}}/>
          <li style={{fontSize: 20}}>Naviger deg til Google Cloud Storage gjennom søkebaren øverst og søk på <b>terraform_state</b> i filteret der bøttene ligger</li>
          <img src={stateBucketImg} style={{width: 350, marginTop: 20, marginBottom: 20}}/>
          <li style={{fontSize: 20}}>Repeter stegene for alle miljøer (sandbox, dev og prod)</li>
      </ol>
    </Content>
  );
}

function ManualInputTeamConfig({
  name,
  areaName,
  projectName,
  pullRequestUrl,
  token
}: {
  name: string;
  areaName: string;
  projectName: string;
  pullRequestUrl: string;
  token: string;
}) {
  const [projectIds, setProjectIds] = useState<GcpConfig>({ sandbox: "", dev: "", prod: "" });
  const [authNumbers, setAuthNumbers] = useState<GcpConfig>({ sandbox: "", dev: "", prod: "" });
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState<string[]>();

  function validateFormInput(): string[] {
    const newErrors: string[] = [];
    Object.keys(projectIds).forEach((k: string) => {
      if (k === "test") return;
      const env = k as "sandbox" | "dev" | "prod";

      if (isProjectNumber(projectIds[env])) newErrors.push(`Flytt om prosjekt-nummer og project-id for ${env}.`);
      else if (!isProjectId(projectIds[env], env))
        newErrors.push(`Feil format for prosjekt-id for ${env}. Format: team-${env}-xxxx`);
    });

    Object.keys(authNumbers).forEach((k: string) => {
      if (k === "test") return;
      const env = k as "sandbox" | "dev" | "prod";

      if (isProjectId(authNumbers[env], env)) newErrors.push(`Flytt om prosjekt-nummer og project-id for ${env}.`);
      else if (!isProjectNumber(authNumbers[env]))
        newErrors.push(`Feil format for prosjekt-nummer for ${env}. Format: Nummer på 12 siffer, f.eks 123456789012`);
    });

    return newErrors;
  }

  async function setConfig() {
    const newErrors = validateFormInput();
    if (newErrors && newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      setIsSending(true);
      await OnboardingClient.updateGcpConfig(token, name, areaName, projectName, projectIds, authNumbers);
    }
  }

  function onChange(env: Env, val: string, state: GcpConfig, setState: (v: GcpConfig) => void) {
    const newState = { ...state };
    newState[env] = val;
    setState(newState);
  }

  return (
    <Content>
      <h2 style={h2Style}>Oppsett av GCP-prosjekt</h2>
      <p style={{ fontSize: 16 }}>
        I det forrige steget ble det opprettet et eget GCP-prosjekt for teamet deres. Nå trenger vi å legge inn ID-er
        som samsvarer med disse nye prosjektene for å gi dere riktige tilganger, samt provisjonere opp ressurser dere
        trenger for å jobbe på dataplattformen.
      </p>
      <p style={{fontSize: 16}}>
        Disse variablene har dere kun tilgjengelig om SKIP/DASK har godkjent PR-en som ble opprettet i forrige steg. For å følge med på status på deres PR i IAM-oppsettet se{" "}
        <a style={{ textDecoration: "underline" }} href={pullRequestUrl} target="_blank">
          her.
        </a>
      </p>

      <h3 style={{ ...h3Style, marginTop: 30 }}>Legg inn prosjekt-IDer fra GCP</h3>
      <InputsForEnvs onChange={(env, val) => onChange(env, val, projectIds, setProjectIds)} />

      <h3 style={{ ...h3Style, marginTop: 30 }}>Legg inn prosjekt-nummer fra GCP</h3>
      <InputsForEnvs onChange={(env, val) => onChange(env, val, authNumbers, setAuthNumbers)} />

      {errors && errors.length > 0 && (
        <ErrorFrame>
          {errors.map((e) => (
            <p>{e}</p>
          ))}
        </ErrorFrame>
      )}
      {isSending ? (
        <div style={{ marginTop: 20 }}>
          <Spinner />
        </div>
      ) : (
        <Button
          key={"submit-gcp-config"}
          onClick={setConfig}
          variant="outlined"
          style={{ marginTop: 30 }}
          type="button"
        >
          Send inn
        </Button>
      )}
      <h2 style={h2Style}>Hvordan finner jeg de riktige parameterene?</h2>
      <ol>
        <li style={{fontSize: 20}}>Logg inn i Google-konsollen {" "}
          <a style={{ textDecoration: "underline" }} href="https://console.cloud.google.com/">her</a></li>
          <li style={{fontSize: 20}}>Velg et av prosjektene dine i venstre hjørne</li>
          <img src={gcpProjectImg} style={{width: 300, marginTop: 20, marginBottom: 20}}/>
          <li style={{fontSize: 20}}>Naviger deg til forsiden og kopier <b>Project number</b> og <b>Project ID</b></li>
          <img src={projectIdsImg} style={{width: 350, marginTop: 20, marginBottom: 20}}/>
          <li style={{fontSize: 20}}>Repeter stegene for alle miljøer (sandbox, dev og prod)</li>
      </ol>
    </Content>
  );
}

type StepMap = { [k in Step]: string[] };
const stepsInStepMap: StepMap = {
  start: ["Start prosess"],
  "setup-ingestor": [
    "Opprette GitHub repo i Kartverket",
    "Hent monorepo oppsett fra DASK",
    "Push monorepo oppsett inn til nytt repo",
    "Overfør repo-eierskap til team",
  ],
  "iam-setup": ["Definer ny team-modul i IAM-repo", "Commit og legg inn PR for nytt team"],
  "gcp-service-accounts-setup": [
    "Manuelt legge inn oppdaterte parametere",
    "Oppdatere gcp-service-accounts repoet",
    "Legge inn PR i gcp-service-accounts med de nye parameterene",
  ],
  "dask-infrastructure-setup": [
    "Konfigurer dask-infrastructure med nytt team og tilhørende parametere",
    "Opprette ny PR",
    "Opprette ressurser i Databricks og sett opp base-tilganger",
  ],
  "configure-ingestor": [
    "Oppdater ingestor-repoet med teamets prosjektconfig",
    "Opprett en PR",
    "Testkjøring av oppsett (gjøres av teamet selv)",
  ],
};

const ErrorFrame = styled.div`
  width: 100%;
  padding: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 30px;
  border-radius: 10px;
  background-color: #cd4c4cad;
`;

const IconFrame = styled.div`
  height: 40px;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StatusTitle = styled.span`
  font-size: 1rem;
  margin-left: 20px;
  margin-top: 1px;
`;

const RowFrame = styled.div`
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

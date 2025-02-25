import React from "react";
import styled from "styled-components";
import KvCheck from "../../common/KvCheck";
import KvInProgress from "../../common/KvInProgress";
import KvTodo from "../../common/KvTodo";
import { Step, StepStatus, TeamDoc } from "../../types";
import { useParams } from "react-router-dom";
import KvManualWarning from "../../common/KvManualWarning";

interface IProps {
  teams: TeamDoc[];
}

export default function OnboardingStatusBar({ teams }: IProps) {
  const params = useParams();
  const team = teams.find((val) => val.name === params.teamId);
  if (!team) return null;

  return (
    <StatusBarFrame>
      {allStatuses.map((statusKey) => (
        <StatusComponent
          key={statusKey}
          step={statusKey}
          latestStatusForStep={team?.last_status?.status}
          currentStatus={team?.last_status?.step}
        />
      ))}
    </StatusBarFrame>
  );
}

const StatusComponent = (props: { step: Step; currentStatus?: Step; latestStatusForStep?: StepStatus}) => {
  const isEndNode = allStatuses.indexOf(props.step) === allStatuses.length - 1;
  const status = getStatus(props.step, props.latestStatusForStep, props.currentStatus);
  const StatusIcon = getStatusIcon(status);

  return (
    <StatusFrame>
      <IconFrame>
        {!isEndNode && <Line />}
        <div style={{ zIndex: 1 }}>{StatusIcon}</div>
      </IconFrame>
      <StatusText style={{ fontWeight: status === "in-progress" || status === "manual-intervention" ? 600 : 400 }}>
        {statusTitleMap[props.step]}
      </StatusText>
    </StatusFrame>
  );
};

function getStatus(step: Step, latestStepStatus?: StepStatus, currentStatus?: Step): StepStatus {
  const indexOfStep = allStatuses.indexOf(step);
  const indexOfCurrentStatus = currentStatus ? allStatuses.indexOf(currentStatus) : -1;

  if (indexOfStep === indexOfCurrentStatus) return latestStepStatus || "in-progress";
  if (indexOfStep < indexOfCurrentStatus) return "done";
  return "todo";
}

function getStatusIcon(status: StepStatus): React.ReactNode {
  if (status === "manual-intervention") return <KvManualWarning />;
  if (status === "in-progress") return <KvInProgress />;
  if (status === "done") return <KvCheck />;
  return <KvTodo />;
}

const Line = styled.div`
  position: absolute;
  height: 3px;
  width: 150px;
  background-color: #777777;
  left: 30px;
  bottom: 16px;
`;

const StatusText = styled.p`
  height: 20px;
  color: #fff;
  font-size: 0.8rem;
`;

const IconFrame = styled.div`
  position: relative;
  height: 30px;
  width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .inprogress {
    animation: rotate 1.5s infinite ease-in-out;

    @keyframes rotate {
    0% {
      transform: rotate(0deg)
    }
    
    100% {
      transform: rotate(360deg)
    }
  }
  
}
`;

const StatusFrame = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  margin-left: 20px;
  margin-right: 20px;
  text-align: center;
`;

const StatusBarFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const allStatuses: Step[] = [
  "setup-ingestor",
  "iam-setup",
  "gcp-service-accounts-setup",
  "dask-infrastructure-setup",
  "configure-ingestor",
];

export const statusTitleMap: { [key: string]: string } = {
  start: "Start",
  "setup-ingestor": "Lag nytt repo for teamet",
  "iam-setup": "PR for nytt GCP-prosjekt",
  "gcp-service-accounts-setup": "PR for tilhørende maskinbrukere",
  "dask-infrastructure-setup": "PR for tilgang til Databricks",
  "configure-ingestor": "Oppdater team-repo med korrekte variabler",
};

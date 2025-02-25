import { Button } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Route, Routes, useNavigate, useLocation, Link } from "react-router-dom";
import OnboardingStatusBar from "./OnboardingStatusBar";
import OnboardingStatus from "./OnboardingStatus";
import { Content, Select, Spinner, h1Style, h2Style, h3Style, pStyle } from "../../common/CommonStyled";
import KvBack from "../../common/KvBack";
import { TeamDoc } from "../../types";
import { OnboardingClient } from "../../backendClient";
import { Input } from "../../common/InputsForEnvs";
import useFetchToken from "../../hooks/useFetchToken";

export const OnboardingComponent = () => {
  const location = useLocation();
  const [readyTeams, setReadyTeams] = useState<TeamDoc[]>([]);
  const [inProgressTeams, setInProgressTeams] = useState<TeamDoc[]>([]);
  const [doneTeams, setDoneTeams] = useState<TeamDoc[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [pollCounter, setPollCounter] = useState(0);
  const [isLoadingTeams, setIsLoadingTeams] = useState<boolean>(true);
  const { token, loading } = useFetchToken();

  const getTeamsForUser = useCallback(async (token: string) => {
    if (token) {
      try {
        const teams = await OnboardingClient.getTeams(token);
        setReadyTeams(teams.ready);
        setInProgressTeams(teams.inProgress);
        setDoneTeams(teams.done);
        setAreas(teams.areas);
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      } finally {
        setIsLoadingTeams(false);
      }
    }
  }, [token]);

  useEffect(() => {
    if (pollCounter > 120) return;
    const interval = setInterval(async () => {
      await getTeamsForUser(token);
      setPollCounter(count => count + 1);
    }, 5000);

    return () => {
      clearInterval(interval);
    }
  }, [pollCounter])

  useEffect(() => {
    getTeamsForUser(token);
  }, [token]);

  const allTeams = [...readyTeams, ...inProgressTeams, ...doneTeams];

  if (loading) {
    return (
      <Content>
        <div style={{ marginTop: 20 }}>
          <Spinner />
        </div>
      </Content>
    );
  }

  return (
    <Frame>
      <Header>
        <Content>
          {location.pathname !== "/dask-onboarding" && location.pathname !== "/dask-onboarding/" && (
            <div style={{ position: "absolute" }}>
              <Link style={{ position: "absolute", top: 30, right: 10 }} to="/dask-onboarding">
                <KvBack />
              </Link>
            </div>
          )}
          <h1 style={h1Style}>Onboarding av team på DASK</h1>
          <Routes>
            <Route path="/status/:teamId" element={<OnboardingStatusBar teams={allTeams} />} />
          </Routes>
        </Content>
      </Header>
      <Routes>
        <Route path="/" element={<MainPage ready={readyTeams} inProgress={inProgressTeams} done={doneTeams} areas={areas} token={token} isLoadingTeams={isLoadingTeams}/>} />
        <Route path="/status/:teamId" element={<OnboardingStatus teams={allTeams} token={token}/>} />
      </Routes>
    </Frame>
  );
};

interface IProps {
  ready: TeamDoc[];
  inProgress: TeamDoc[];
  done: TeamDoc[];
  areas: string[];
  token: string;
  isLoadingTeams: boolean;
}

const MainPage = ({ ready, inProgress, done, areas, token, isLoadingTeams }: IProps) => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [projectName, setProjectName] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isProjectNameTouched, setIsProjectNameTouched] = useState<boolean>(false);

  const navigate = useNavigate();
  const themecolor = window.localStorage.getItem("theme") === "dark" ? "white" : "black"; // Pga SVG data nedenfor kan man ikke ha hash-hexcode. Kan evt bruke %23, må da ha custom handling

  async function onOnboardingClick(team: string, division: string) {
    await OnboardingClient.startOnboarding(token, team, division, projectName);
    navigate(`/dask-onboarding/status/${team}`);
  }

  const validateInput = (value: string): boolean => {
    // Only lower-case letters and dashes with no spaces or other special characters. Max length of 17
    return /^[a-z-]{1,17}$/.test(value);
  };

  const checkButtonState = (name: string, team: string, division: string) => {
    const isInputValid = validateInput(name);
    const isTeamSelected = team !== '';
    const isDivisionSelected = division !== '';
    setIsButtonDisabled(!(isInputValid && isTeamSelected && isDivisionSelected));
  };

  const handleTeamChange = (value: string) => {
    setSelectedTeam(value);
    checkButtonState(projectName, value, selectedDivision);
  };
  
  const handleDivisionChange = (value: string) => {
    setSelectedDivision(value);
    checkButtonState(projectName, selectedTeam, value);
  };

  const handleProjectChange = (value: string) => {
    setProjectName(value);
    setIsProjectNameTouched(true);
    checkButtonState(value, selectedTeam, selectedDivision);
  };

  const isProjectNameValid = validateInput(projectName);

  return (
    <Content>
      <h2 style={h2Style}>Velkommen til onboardingssiden!</h2>
      <p style={pStyle} color="#00000">
        Velkommen til hovedsiden for onboarding på DASK. På denne siden kan du onboarde deg og ditt team. Onboardingen
        forutsetter at du har en AD-gruppe som er provisjonert opp i repoet{" "}
        <a style={{ textDecoration: "underline" }} href="https://github.com/kartverket/entra-id-config" target="_blank">
          entra-id-config
        </a>. Om du ikke har det enda kan du legge inn en pull request i repoet for å få opprettet en gruppe. Les mer om dette på SKIP sin{" "}
        <a style={{ textDecoration: "underline" }} href="https://kartverket.atlassian.net/wiki/spaces/SKIPDOK/pages/1116209155/Legge+til+eller+fjerne+personer+fra+et+team" target="_blank">
          dokumentasjonsside
        </a>, eller kontakt DASK for å få hjelp.
        <p>Når du har en AD-gruppe skal{" "}<i>teamnavn</i> dukke opp i dropdownen nedenfor.</p>
      </p>

      <h2 style={h2Style}>Velg et team fra dropdownen</h2>
      {isLoadingTeams ? (
        <Content>
          <div style={{ marginTop: 20 }}>
            <Spinner />
          </div>
        </Content>
      ) : (
        <>
          <Select onChange={(e) => handleTeamChange(e.target.value)} themecolor={themecolor}>
            <option>Velg et team...</option>
            {ready.length > 0 ? (
              ready.map((team) => (
                <option key={team.name} value={team.name}>
                  {team.name}
                </option>
              ))
            ) : (
              <option>Ingen å velge ennå...</option>
            )}
          </Select>

          <Select style={{ marginLeft: 10 }} onChange={(e) => handleDivisionChange(e.target.value)} themecolor={themecolor}>
            <option>Velg divisjon</option>
            {areas.map((divisjon) => (
              <option key={divisjon} value={divisjon.toLowerCase()}>
                {divisjon}
              </option>
            ))}
          </Select>
        </>
      )}
      <h2 style={h2Style}>Velg et navn for GCP-prosjektet ditt</h2>
      <p>Hvis du ønsker å bruke et som allerede eksisterer, må du skrive det riktige prosjektnavnet under. 
        En liste over alle prosjekter som eksisterer på SKIP kan du finne{" "}
        <a style={{ textDecoration: "underline" }} href="https://github.com/kartverket/iam/blob/main/dynamic/env/teams/modules.tf" target="_blank">
          her.
        </a>
      </p>
        <Input
          placeholder="Navn på prosjekt"
          isdark={false}
          onChange={(e) => handleProjectChange(e.target.value)}
          style={{
            borderColor: isProjectNameTouched && !isProjectNameValid ? 'red' : '',
            borderWidth: isProjectNameTouched && !isProjectNameValid ? '2px' : '',
            borderStyle: isProjectNameTouched && !isProjectNameValid ? 'solid' : ''
          }}
        />

      <Button
        key={selectedTeam}
        onClick={() => onOnboardingClick(selectedTeam, selectedDivision)}
        variant="outlined"
        style={{ marginLeft: 20, marginBottom: 2 }}
        type="button"
        disabled={isButtonDisabled}
        >
        Start onboarding
      </Button>
        {isProjectNameTouched && !isProjectNameValid && (
          <p style={{ color: 'red' }}>Kun små bokstaver og bindestreker uten mellomrom - maks 17 tegn!</p>
        )}

      <h2 style={h2Style}>Mine onboardinger</h2>
      <ListOnboardingProcessesForStatus title="Pågående" onboardingProcesses={inProgress} />
      <ListOnboardingProcessesForStatus title="Avsluttede" onboardingProcesses={done} />
    </Content>
  );
};

function ListOnboardingProcessesForStatus(props: { title: string; onboardingProcesses: TeamDoc[] }) {
  return (
    <>
      <h3 style={{ ...h3Style, marginTop: "2rem" }}>
        {props.title} ({props.onboardingProcesses.length})
      </h3>
      {props.onboardingProcesses.length > 0 ? (
        props.onboardingProcesses.map((team) => (
          <Link key={team.name} to={`/dask-onboarding/status/${team.name}`}>
            <p>{team.name}</p>
          </Link>
        ))
      ) : (
        <p>Ingenting å vise her...</p>
      )}
    </>
  );
}

const Header = styled.div`
  padding-top: 40px;
  padding-bottom: 40px;
  width: 100%;
  background-color: #000584;
`;

const Frame = styled.div`
  height: 100%;
  width: 100%;
`;

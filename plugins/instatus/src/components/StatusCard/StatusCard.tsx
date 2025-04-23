import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
  InfoCard,
  StatusOK,
  StatusError,
  StatusWarning,
  Link,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { Button } from '@material-ui/core';
import UmbrellaLogo from './umbrella.svg';
import WarningLogo from './warning.svg';

const useStyles = makeStyles({
  wrapper: {
    textAlign: 'center',
    margin: 20,
  },
  actionButton: {
    margin: 10,
    display: 'inline-block',
  },
  logoWrapper: {
    display: 'block',
  },
  logo: {
    maxWidth: 500,
  },
});

type Impact =
  | 'OPERATIONAL'
  | 'UNDERMAINTENANCE'
  | 'DEGRADEDPERFORMANCE'
  | 'PARTIALOUTAGE'
  | 'MAJOROUTAGE';
type StatusType = 'INVESTIGATING' | 'IDENTIFIED' | 'MONITORING' | 'RESOLVED';
type Incident = {
  name: string;
  started: string;
  status: StatusType;
  impact: Impact;
  url: string;
};

type Maintenance = {
  name: string;
  start: string;
  status: 'NOTSTARTEDYET' | 'INPROGRESS' | 'COMPLETED';
  duration: string;
  url: string;
};

type Status = {
  page: {
    name: string;
    url: string;
    status: 'UP' | 'HASISSUES' | 'UNDERMAINTENANCE';
  };
  activeIncidents: Incident[];
  activeMaintenances: Maintenance[];
};

type DenseTableProps = {
  pageId: string;
  status: Status | undefined;
  reportUrl: string | undefined;
};

export const CardView = ({ pageId, status, reportUrl }: DenseTableProps) => {
  const classes = useStyles();

  if (!status) return null;

  const incidentColumns: TableColumn[] = [
    { field: 'status', title: 'Status' },
    { field: 'description', title: 'Description' },
    { field: 'date', title: 'Started at' },
  ];

  const maintenanceColumns: TableColumn[] = [
    { field: 'status', title: 'Status' },
    { field: 'description', title: 'Description' },
    { field: 'date', title: 'Will start at' },
    { field: 'duration', title: 'Duration' },
  ];

  const incidents = status.activeIncidents?.map(incident => {
    const Status = {
      INVESTIGATING: StatusError,
      IDENTIFIED: StatusError,
      MONITORING: StatusWarning,
      RESOLVED: StatusOK,
    }[incident.status];

    const impact = {
      OPERATIONAL: 'System is operational',
      UNDERMAINTENANCE: 'Under maintenance',
      DEGRADEDPERFORMANCE: 'Degraded performance',
      PARTIALOUTAGE: 'Partial outage',
      MAJOROUTAGE: 'Major outage',
    };

    return {
      status: (
        <Status>
          {incident.status} - {impact[incident.impact] || ''}
        </Status>
      ),
      date: new Date(incident.started).toLocaleString('no-NO'),
      description: (
        <Link to={incident.url} target="_blank">
          {incident.name}
        </Link>
      ),
    };
  });

  const plannedMaintenances = status.activeMaintenances?.map(maintenance => {
    const Status = {
      NOTSTARTEDYET: StatusWarning,
      INPROGRESS: StatusWarning,
      COMPLETED: StatusOK,
    }[maintenance.status];

    return {
      status: <Status>{maintenance.status}</Status>,
      date: new Date(maintenance.start).toLocaleString('no-NO'),
      duration: maintenance.duration,
      description: (
        <Link to={maintenance.url} target="_blank">
          {maintenance.name}
        </Link>
      ),
    };
  });

  return (
    <InfoCard title="Current Status">
      <div className={classes.wrapper}>
        <div className={classes.logoWrapper}>
          {status.page.status === 'UP' && (
            <img src={UmbrellaLogo} className={classes.logo} />
          )}
          {status.page.status !== 'UP' && (
            <img src={WarningLogo} className={classes.logo} />
          )}
        </div>
        {status.page.status === 'UP' && (
          <StatusOK>Everything is fine!</StatusOK>
        )}
        {status.page.status === 'UNDERMAINTENANCE' && (
          <StatusWarning>We are performing routine maintenance</StatusWarning>
        )}
        {status.page.status === 'HASISSUES' && (
          <StatusError>We are having issues!</StatusError>
        )}
      </div>
      {!!incidents && (
        <Table
          title="Active Incidents"
          options={{
            search: false,
            paging: false,
          }}
          data={incidents}
          columns={incidentColumns}
        />
      )}
      {!!plannedMaintenances && (
        <Table
          title="Planned Maintenance"
          options={{
            search: false,
            paging: false,
          }}
          data={plannedMaintenances}
          columns={maintenanceColumns}
        />
      )}
      <div className={classes.wrapper}>
        <Button
          variant="outlined"
          className={classes.actionButton}
          href={`https://${pageId}.instatus.com`}
          target="_blank"
        >
          View full status page
        </Button>
        {reportUrl != undefined && (
          <Button
            variant="outlined"
            className={classes.actionButton}
            href={reportUrl}
            target="_blank"
          >
            Report ongoing issue
          </Button>
        )}
      </div>
    </InfoCard>
  );
};

export const StatusCard = ({
  pageId,
  reportUrl,
}: {
  pageId: string;
  reportUrl?: string;
}) => {
  const { value, loading, error } = useAsync(async (): Promise<Status> => {
    return fetch(`https://${pageId}.instatus.com/summary.json`).then(res =>
      res.json(),
    );
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <CardView status={value} pageId={pageId} reportUrl={reportUrl} />;
};

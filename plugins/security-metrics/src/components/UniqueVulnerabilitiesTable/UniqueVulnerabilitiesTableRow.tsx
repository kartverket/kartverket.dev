import { useState } from 'react';
import type {
  AggregatedAffectedComponent,
  AggregatedVulnerability,
} from '../../typesFrontend';
import { Scanner } from '../../typesFrontend';
import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Collapse from '@mui/material/Collapse';
import Link from '@mui/material/Link';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { SeverityTag } from '../shared/SeverityTag.tsx';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { StyledTableRow } from '../shared/StyledTableRow';
import { AggregatedVulnerabilityContext } from './AggregatedVulnerabilityContext';
import { ContextTag } from './ContextTag.tsx';
import { ClusterTag } from './ClusterTag.tsx';
import { groupClustersByLabel, sortClusters } from './utils';

type Props = {
  vulnerability: AggregatedVulnerability;
};

type ComponentContextProps = {
  component: AggregatedAffectedComponent;
  hasDependabot: boolean;
  hasSysdig: boolean;
};

const ComponentClusters = ({ clusters }: { clusters: string[] }) => {
  const grouped = groupClustersByLabel(clusters);
  const labels = sortClusters([...grouped.keys()]);
  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {labels.map(label => (
        <ClusterTag
          key={label}
          cluster={label}
          tooltip={grouped.get(label)!.join(', ')}
        />
      ))}
    </Box>
  );
};

const ComponentContextTags = ({
  component,
  hasDependabot,
  hasSysdig,
}: ComponentContextProps) => (
  <Box
    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}
  >
    {hasSysdig && component.isRunning !== null && (
      <ContextTag
        variant={component.isRunning ? 'running' : 'notRunning'}
        label={component.isRunning ? 'Kjører' : 'Kjører ikke'}
        Icon={GpsFixedIcon}
        tooltip={
          component.isRunning
            ? 'Den sårbare pakken er i bruk i en kjørende applikasjon.'
            : 'Den sårbare pakken er ikke i bruk i en kjørende applikasjon.'
        }
      />
    )}
    {hasDependabot && component.isDirect !== null && (
      <ContextTag
        variant={component.isDirect ? 'direct' : 'transitive'}
        label={component.isDirect ? 'Direkte' : 'Transitiv'}
        Icon={SubdirectoryArrowRightIcon}
        tooltip={
          component.isDirect
            ? 'Sårbarheten finnes i en pakke prosjektet bruker direkte, ikke via en transitiv avhengighet.'
            : 'Indirekte avhengighet via et tredjepartsbibliotek.'
        }
      />
    )}
  </Box>
);

export const UniqueVulnerabilitiesTableRow = ({ vulnerability }: Props) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const components = vulnerability.affectedComponents;
  const singleComponent = components.length === 1 ? components[0] : null;

  const hasDependabot = vulnerability.scanners.includes(Scanner.Dependabot);
  const hasSysdig = vulnerability.scanners.includes(Scanner.Sysdig);
  const showComponentContext = hasDependabot || hasSysdig;
  const canExpand = components.length > 1;

  const aggregatedClusters = components.flatMap(c => c.sysdigClusters ?? []);

  const goToComponent = (componentName: string) => {
    navigate(
      `/catalog/default/component/${encodeURIComponent(componentName)}/securityMetrics`,
    );
  };

  return (
    <>
      <StyledTableRow>
        <TableCell>
          <SeverityTag severity={vulnerability.severity} />
        </TableCell>

        <TableCell>
          <Typography variant="body2">
            {vulnerability.vulnerabilityId}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {vulnerability.summary}
          </Typography>
        </TableCell>

        <TableCell>
          <AggregatedVulnerabilityContext vulnerability={vulnerability} />
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              {singleComponent ? (
                <Link
                  component="button"
                  variant="body2"
                  underline="hover"
                  onClick={() => goToComponent(singleComponent.componentName)}
                  sx={{ textAlign: 'left' }}
                >
                  {singleComponent.componentName}
                </Link>
              ) : (
                <Typography variant="body2">
                  {components.length} komponenter
                </Typography>
              )}
              {aggregatedClusters.length > 0 && (
                <ComponentClusters clusters={aggregatedClusters} />
              )}
            </Box>
            {canExpand && (
              <IconButton
                size="small"
                onClick={() => setExpanded(v => !v)}
                aria-label={expanded ? 'Vis færre' : 'Vis alle'}
                sx={{
                  flexShrink: 0,
                  transform: expanded ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              >
                <ExpandMoreIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </TableCell>
      </StyledTableRow>

      {canExpand && (
        <TableRow>
          <TableCell
            colSpan={4}
            sx={{
              p: 0,
              borderBottom: expanded
                ? theme => `1px solid ${theme.palette.divider}`
                : 'none',
            }}
          >
            <Collapse in={expanded} unmountOnExit>
              <Table size="small" sx={{ tableLayout: 'fixed' }}>
                <TableBody>
                  {components.map(component => (
                    <StyledTableRow
                      key={component.componentName}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => goToComponent(component.componentName)}
                    >
                      <TableCell sx={{ borderBottom: 'none', width: 190 }} />
                      <TableCell sx={{ borderBottom: 'none', width: '30%' }} />
                      <TableCell sx={{ borderBottom: 'none', width: 360 }}>
                        {showComponentContext && (
                          <ComponentContextTags
                            component={component}
                            hasDependabot={hasDependabot}
                            hasSysdig={hasSysdig}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2">
                            {component.componentName}
                          </Typography>

                          {!!component.sysdigClusters?.length && (
                            <ComponentClusters
                              clusters={component.sysdigClusters}
                            />
                          )}

                          <ArrowForwardIosIcon
                            fontSize="inherit"
                            sx={{ ml: 'auto', opacity: 0.4, flexShrink: 0 }}
                          />
                        </Box>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

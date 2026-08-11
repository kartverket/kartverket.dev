import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BugReportIcon from '@mui/icons-material/BugReport';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import BuildIcon from '@mui/icons-material/Build';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import type {
  AggregatedVulnerability,
  ContextSignal,
} from '../../typesFrontend';

type Descriptor = {
  Icon: ComponentType<SvgIconProps>;
  label: string;
  description: string;
  matches?: (v: AggregatedVulnerability) => boolean;
};

export const CONTEXT_DESCRIPTIONS: Record<ContextSignal, Descriptor> = {
  kev: {
    Icon: WarningAmberIcon,
    label: 'Kjent utnyttet',
    description:
      'Eksempler på kjent utnyttelse er oppført i CISA Known Exploited Vulnerabilities (KEV).',
    matches: v => v.isCisaKEV,
  },
  exploit: {
    Icon: BugReportIcon,
    label: 'Exploit',
    description: 'Metode for å utnytte sårbarheten er offentlig kjent.',
    matches: v => v.isExploitable,
  },
  running: {
    Icon: GpsFixedIcon,
    label: 'Kjører',
    description: 'Den sårbare pakken er i bruk i en kjørende applikasjon.',
    matches: v => v.affectedComponents.some(c => c.isRunning === true),
  },
  notRunning: {
    Icon: GpsFixedIcon,
    label: 'Kjører ikke',
    description: 'Den sårbare pakken er ikke i bruk i en kjørende applikasjon.',
  },
  fix: {
    Icon: BuildIcon,
    label: 'Fiks',
    description: 'Det finnes en patchet versjon.',
    matches: v => v.isFixable,
  },
  noFix: {
    Icon: BuildIcon,
    label: 'Ingen fiks',
    description: 'Ingen patchet versjon er tilgjengelig ennå.',
  },
  direct: {
    Icon: SubdirectoryArrowRightIcon,
    label: 'Direkte',
    description:
      'Sårbarheten finnes i en pakke prosjektet bruker direkte, ikke via en transitiv avhengighet.',
    matches: v => v.affectedComponents.some(c => c.isDirect === true),
  },
  transitive: {
    Icon: SubdirectoryArrowRightIcon,
    label: 'Transitiv',
    description: 'Indirekte avhengighet via et tredjepartsbibliotek.',
  },
};

export const CONTEXT_FACETS = (
  Object.entries(CONTEXT_DESCRIPTIONS) as [ContextSignal, Descriptor][]
).filter(
  (entry): entry is [ContextSignal, Required<Descriptor>] => !!entry[1].matches,
);

export const CONTEXT_LEGEND = Object.values(CONTEXT_DESCRIPTIONS).filter(
  (entry, index, arr) =>
    arr.findIndex(other => other.Icon === entry.Icon) === index,
);

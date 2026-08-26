import { RiscStatusData } from '../../typesFrontend';
import { RiscStatusCardBase } from './RiscStatusCardBase';
import {
  OwnerRiscGroup,
  RiscStatusByTeamDialog,
} from './RiscStatusByTeamDialog';
import { UNKNOWN_TEAM } from './TeamRiscSection';

interface Props {
  data: RiscStatusData[];
}

const groupByOwner = (statuses: RiscStatusData[]): OwnerRiscGroup[] => {
  const buckets = new Map<string, RiscStatusData[]>();
  for (const s of statuses) {
    const key = s.owner ?? UNKNOWN_TEAM;
    const bucket = buckets.get(key) ?? [];
    bucket.push(s);
    buckets.set(key, bucket);
  }
  return [...buckets.entries()]
    .map(([owner, s]) => ({ owner, statuses: s }))
    .sort((a, b) => {
      if (a.owner === UNKNOWN_TEAM) return 1;
      if (b.owner === UNKNOWN_TEAM) return -1;
      return b.statuses.length - a.statuses.length;
    });
};

export const RiscStatusByTeamCard = ({ data }: Props) => (
  <RiscStatusCardBase
    data={data}
    renderDialog={({ label, statuses, isOpen, setOpen }) => (
      <RiscStatusByTeamDialog
        categoryLabel={label}
        groups={groupByOwner(statuses)}
        isDialogOpen={isOpen}
        setIsDialogOpen={setOpen}
      />
    )}
  />
);

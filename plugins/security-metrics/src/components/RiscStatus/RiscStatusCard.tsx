import { RiscStatusData } from '../../typesFrontend';
import { RiscStatusCardBase } from './RiscStatusCardBase';
import { RiscStatusDialog } from './RiscStatusDialog';

interface Props {
  data: RiscStatusData[];
}

export const RiscStatusCard = ({ data }: Props) => (
  <RiscStatusCardBase
    data={data}
    renderDialog={({ label, statuses, isOpen, setOpen }) => (
      <RiscStatusDialog
        categoryLabel={label}
        riscStatuses={statuses}
        isDialogOpen={isOpen}
        setIsDialogOpen={setOpen}
      />
    )}
  />
);

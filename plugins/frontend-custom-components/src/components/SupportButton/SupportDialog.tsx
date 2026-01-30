import { Dialog, DialogHeader, DialogBody, Text } from '@backstage/ui';

type DialogComponentProps = {
  isOpen: boolean;
  onClick: () => void;
  header?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

const SupportDialog = ({
  isOpen,
  onClick,
  header,
  children,
  className,
}: DialogComponentProps) => {
  return (
    <Dialog isOpen={isOpen} onOpenChange={onClick} className={className}>
      <DialogHeader>
        <Text variant="title-small" weight="bold">
          {header}
        </Text>
      </DialogHeader>
      <DialogBody>{children}</DialogBody>
    </Dialog>
  );
};

export default SupportDialog;

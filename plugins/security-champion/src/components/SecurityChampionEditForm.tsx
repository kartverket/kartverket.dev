import { UserEntity } from '@backstage/catalog-model';
import { Button } from '@backstage/ui';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { ErrorBanner } from './ErrorBanner';
import { UserSearch } from './UserSearch';

interface SecurityChampionEditFormProps {
  title: string;
  selectedUser: UserEntity | null;
  onSelect: (user: UserEntity) => void;
  isMutationError: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onDownloadCsv: () => void;
}

export const SecurityChampionEditForm = ({
  title,
  selectedUser,
  onSelect,
  isMutationError,
  onConfirm,
  onCancel,
  onDownloadCsv,
}: SecurityChampionEditFormProps) => (
  <>
    <IconButton
      disabled
      aria-label="Download CSV (disabled in edit mode)"
      onClick={onDownloadCsv}
      sx={{ float: 'right' }}
    >
      <DownloadIcon />
    </IconButton>

    <UserSearch selectedUser={selectedUser} onSelect={onSelect} />

    {isMutationError && (
      <ErrorBanner errorMessage="Failed to set security champion" />
    )}

    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
      <Button onClick={onConfirm} isDisabled={!selectedUser}>
        {title}
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
    </Stack>
  </>
);

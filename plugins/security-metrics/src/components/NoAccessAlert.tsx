import { OpenInFull } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';

export interface NoAccessProps {
  repos: string[];
}

const NoAccessAlert = ({ repos }: NoAccessProps) => {
  const [openDialog, setOpenDialog] = useState(false);

  const openDialogBox = () => {
    setOpenDialog(true);
  };

  const closeDialogBox = () => {
    setOpenDialog(false);
  };

  return (
    <Alert
      severity="warning"
      action={
        repos.length >= 1 && (
          <IconButton
            children={<OpenInFull fontSize="small" />}
            color="inherit"
            onClick={openDialogBox}
          />
        )
      }
    >
      <AlertTitle>
        Du mangler tilgang til {repos.length}
        {` komponent${repos.length > 1 ? 'er' : ''}`}
      </AlertTitle>
      <Dialog open={openDialog} onClose={closeDialogBox}>
        <DialogTitle>Komponenter du mangler tilgang til</DialogTitle>
        <DialogContent>
          {repos.map(repo => (
            <div key={repo}>{repo}</div>
          ))}
        </DialogContent>
      </Dialog>
    </Alert>
  );
};

export default NoAccessAlert;

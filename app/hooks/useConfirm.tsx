import { ReactNode, useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const useConfirm = (
  title: string = 'Are you sure?',
  message?: string | ReactNode,
): [
  () => JSX.Element,
  (message?: string | ReactNode) => Promise<boolean | void>,
] => {
  const [content, setContent] = useState<{
    title: string;
    message?: string | ReactNode;
  }>({ title, message });
  const [promise, setPromise] = useState<null | {
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }>(null);

  const confirm = (message?: string | ReactNode) => {
    if (message) {
      setContent((content) => ({
        title: content.title,
        message: message || content.message,
      }));
    }
    return new Promise<boolean>((resolve, reject) => {
      setPromise({ resolve, reject });
    }).catch(() => {});
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.reject();
    handleClose();
  };
  // You could replace the Dialog with your library's version
  const ConfirmationDialog = () => (
    <Dialog open={promise !== null} fullWidth>
      <DialogTitle>{content.title}</DialogTitle>
      <DialogContent dividers>
        {content.message &&
          (typeof content.message === 'string' ? (
            <DialogContentText>{content.message}</DialogContentText>
          ) : (
            content.message
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm}>Yes</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
  return [ConfirmationDialog, confirm];
};

export default useConfirm;

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@material-ui/core";

export default function ConfirmDialog({ open, title = "Confirm", content, confirmText = "Delete", cancelText = "Cancel", onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="confirm-dialog-title">
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      {content && (
        <DialogContent>
          <Typography>{content}</Typography>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button onClick={onConfirm} color="secondary" variant="contained">{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
}

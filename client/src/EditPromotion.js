import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const EditPromotion = ({ edit, onEdit }) => {
  const [payload, setPayload] = useState({});

  useEffect(() => {
    setPayload(JSON.parse(JSON.stringify(edit)))
  }, [edit])

  const handleSave = () => onEdit(payload);

  const handleClose = () => onEdit(null);

  //TODO: add more fields dynamically
  return (
    <div>
      <Dialog open={Boolean(edit)} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit promotion</DialogTitle>
        <DialogContent>
          {
            Object.entries((edit || { fields: {} }).fields).map(([key, field]) => {

              return (
                <TextField
                  onInput={e => setPayload({
                    ...payload, fields: { ...payload.fields, [key]: e.target.value }
                  })}
                  key={key}
                  autoFocus
                  margin="dense"
                  label={key}
                  type="text"
                  defaultValue={field}
                  fullWidth
                />
              )
            })
          }

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditPromotion


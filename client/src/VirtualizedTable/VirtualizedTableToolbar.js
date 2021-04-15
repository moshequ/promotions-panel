import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from '@material-ui/core/IconButton';
import ControlPointDuplicateIcon from '@material-ui/icons/ControlPointDuplicate';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from "clsx";

const VirtualizedTableToolbar = ({ style, selected, resetSelected, classes, onDelete, onDuplicate }) => {
  const handlers = {
    DELETE: onDelete ? event => {
      resetSelected()
      onDelete({ event, payload: selected })
    } : null,
    DUPLICATE: onDuplicate ? event => {
      resetSelected()
      onDuplicate({ event, payload: selected })
    } : null,
  }

  return (
    <>
      {
        selected.length > 0 && (
          <Toolbar style={style} className={clsx(classes.highlight, classes.fixedLoading)}>

            <Typography
              className={classes.title}
              color="inherit" variant="subtitle1">
              {selected.length} selected
            </Typography>

            <Tooltip title="Duplicate">
              <IconButton onClick={handlers.DUPLICATE}>
                <ControlPointDuplicateIcon/>
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton onClick={handlers.DELETE}>
                <DeleteIcon/>
              </IconButton>
            </Tooltip>
          </Toolbar>
        )}
    </>
  )
}

export default VirtualizedTableToolbar

import React, { useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const VirtualizedTableMenu = (props) => {
  const { options, classes, style, isSelected } = props

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = e => setAnchorEl(e.currentTarget)
  const closeMenu = () => setAnchorEl(null)
  const wrapOptions = options.map(option => ({
    ...option,
    handleClick: option.handleClick ? (...args) => {
      closeMenu()
      return option.handleClick(...args)
    } : null
  }))

  return (
    <TableCell
      component="div"
      className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
      variant="head"
      style={style}
    >
      <IconButton disabled={isSelected} onClick={openMenu}>
        <MoreVertIcon/>
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={closeMenu}>
        {wrapOptions.map(({ label, handleClick }) => (
          <MenuItem key={label} onClick={handleClick}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </TableCell>
  );
}

export default VirtualizedTableMenu

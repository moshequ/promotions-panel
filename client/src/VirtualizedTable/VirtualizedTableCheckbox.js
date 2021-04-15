import React from "react";
import TableCell from "@material-ui/core/TableCell";
import clsx from "clsx";
import Checkbox from "@material-ui/core/Checkbox";

const VirtualizedTableCheckbox = ({ onCheck, isSelected, classes, style }) => {
  return (
    <TableCell
      component="div"
      className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
      variant="head"
      style={style}
    >
      <Checkbox checked={isSelected || false} onClick={onCheck}/>
    </TableCell>
  );
}

export default VirtualizedTableCheckbox

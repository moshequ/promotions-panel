import React from "react";
import TableCell from "@material-ui/core/TableCell";
import clsx from "clsx";

const VirtualizedTableHeader = ({ field, onRowClick, classes, style }) => {
  return (
    <TableCell
      component="div"
      className={clsx(classes.tableCell, classes.flexContainer, {
        [classes.noClick]: !onRowClick,
      })}
      variant="body"
      style={style}
    >
      {field}
    </TableCell>
  );
}

export default VirtualizedTableHeader

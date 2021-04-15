import React  from "react";
import TableCell from "@material-ui/core/TableCell";
import clsx from "clsx";

const VirtualizedTableHeader = ({ label, headerHeight, classes, width }) => {
  return (
    <TableCell
      component="div"
      className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
      variant="head"
      width={width}
      style={{ height: headerHeight }}
    >
      <span>{label}</span>
    </TableCell>
  )
}

export default VirtualizedTableHeader

import React from "react";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { makeStyles } from "@material-ui/core/styles";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { resolveField } from "../utils/Utils";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > .MuiTableCell-sizeSmall": {
      padding: theme.spacing(0, 3, 1, 0),
    },
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
    },
  },
}));

export default function BasicTable({
  data,
  columns,
  tableContainerProps,
  headerCellProps = { style: { fontWeight: "bold" } },
  rowsCellProps,
  size = "small",
  stickyHeader = true,
  sortField,
  sortDirection,
  onRequestSort,
  renderPrependRow,
}) {
  const classes = useStyles();
  const rows = data ? (Array.isArray(data) ? data : [data]) : [];

  return (
    <TableContainer {...tableContainerProps} style={{ overflow: "hidden", ...(tableContainerProps?.style || {}) }}>
      <SimpleBar style={{ maxHeight: "100%" }} autoHide={false}>
        <Table stickyHeader={stickyHeader} aria-label="table" size={size}>
          <TableHead>
            <TableRow className={classes.root}>
              {columns.map((col, i) => {
                const isActive = col.field && sortField === col.field;
                const isSortable = col.sortable;
                return (
                  <TableCell key={i} {...headerCellProps} align={col.align ? col.align : "left"}>
                    {isSortable ? (
                      <TableSortLabel
                        active={isActive}
                        direction={isActive ? (sortDirection === "desc" ? "desc" : "asc") : "asc"}
                        onClick={() => onRequestSort && onRequestSort(col.field)}
                      >
                        {col.title}
                      </TableSortLabel>
                    ) : (
                      col.title
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {renderPrependRow ? renderPrependRow() : null}
            {rows.map((row, i) => (
              <TableRow key={i} className={`${classes.root} ${classes.row}`}>
                {columns.map((col, ci) => {
                  const value = resolveField(row, col.field);
                  let content = value;
                  if (col.render) {
                    content = col.render(row);
                  } else if (col.renderValue) {
                    content = col.renderValue(value);
                  }
                  return (
                    <TableCell {...rowsCellProps} key={`${ci}-${col.field || "_"}`} component="th" scope="row" align={col.align ? col.align : "left"}>
                      {content}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SimpleBar>
    </TableContainer>
  );
}

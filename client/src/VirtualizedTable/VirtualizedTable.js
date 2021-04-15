import React from "react";
import clsx from "clsx";
import VirtualizedTableHeader from "./VirtualizedTableHeader";
import VirtualizedTableCell from "./VirtualizedTableCell";
import VirtualizedTableCheckbox from "./VirtualizedTableCheckbox";
import VirtualizedTableMenu from "./VirtualizedTableMenu";
import VirtualizedTableToolbar from "./VirtualizedTableToolbar";
import LinearProgress from "@material-ui/core/LinearProgress";
import { AutoSizer, Column, Table } from "react-virtualized";
import { lighten, withStyles } from "@material-ui/core/styles";

// TODO: support dynamic height
const styles = (theme) => ({
  fixedLoading: { position: 'fixed', top: 0, right: 0, left: 0 },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
  highlight: {
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85)
  },
  title: {
    flex: '1 1 100%',
  },
});

// TODO: analyze performance, potentially, take advantage of useMemo/useCallback/shouldComponentUpdate TBD
class VirtualizedTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { selected: {} };
  }

  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick,
    });
  };

  cellRenderer = ({ dataKey, rowData: { fields } }) => {
    const { classes, rowHeight, onRowClick } = this.props;

    return (
      <VirtualizedTableCell
        classes={classes}
        style={{ height: rowHeight }}
        onRowClick={onRowClick}
        field={fields[dataKey]}
      />
    )
  };

  handleCheck = ({ rowData, dataKey }) => {
    this.setState(state => {
      const selected = { ...state.selected }

      if (selected[rowData[dataKey]]) delete selected[rowData[dataKey]]
      else selected[rowData[dataKey]] = true

      return { ...state, selected }
    })
  }

  checkboxRenderer = (params) => {
    const { headerHeight, classes, onRowCheck } = this.props;
    const { rowData, dataKey } = params;

    let onCheck

    onCheck = event => {
      this.handleCheck({ event, ...params })
      return onRowCheck ? onRowCheck({ event, ...params }) : null
    };

    return (
      <VirtualizedTableCheckbox
        classes={classes}
        style={{ height: headerHeight }}
        isSelected={this.state.selected[rowData[dataKey]]}
        onCheck={onCheck}/>
    )
  };

  menuRenderer = (params) => {
    const { dataKey, rowData } = params
    const { headerHeight, classes, onEdit, onDelete, onDuplicate } = this.props;

    const handlers = {
      EDIT: onEdit ? event => onEdit({ event, ...params, payload: [rowData[dataKey]] }) : null,
      DELETE: onDelete ? event => onDelete({ event, ...params, payload: [rowData[dataKey]] }) : null,
      DUPLICATE: onDuplicate ? event => onDuplicate({ event, ...params, payload: [rowData[dataKey]] }) : null,
    }

    const options = rowData.actions.map(actions => ({ ...actions, handleClick: handlers[actions.trigger] }))

    return (
      <VirtualizedTableMenu
        options={options}
        rowData={rowData}
        classes={classes}
        style={{ height: headerHeight }}
        isSelected={this.state.selected[rowData[dataKey]]}
      />
    )
  };

  headerRenderer = ({ label, width }) => {
    const { headerHeight, classes } = this.props;

    return (
      <VirtualizedTableHeader label={label} width={width} headerHeight={headerHeight} classes={classes}/>
    )
  };

  render() {
    const {
      loading,
      classes,
      columns,
      checkbox,
      headerHeight,
      actions,
      onDelete,
      onDuplicate,
      ...tableProps
    } = this.props;
    const MIN_TABLE_WIDTH = columns.reduce((sum, { width }) => sum + width, 0);

    return (
      <>
        {loading && <LinearProgress className={classes.fixedLoading}/>}

        <VirtualizedTableToolbar
          title={'Promotions'}
          selected={Object.keys(this.state.selected)}
          resetSelected={() => this.setState({...this.state, selected: {}})}
          style={{ height: headerHeight }}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          classes={classes}/>

        <AutoSizer>
          {({ height, width }) => (
            <Table
              height={height}
              width={width < MIN_TABLE_WIDTH ? MIN_TABLE_WIDTH : width}
              gridStyle={{ direction: 'inherit', }}
              className={classes.table}
              headerHeight={headerHeight}
              {...tableProps}
              rowClassName={this.getRowClassName}
            >
              {
                columns.length && checkbox &&
                <Column
                  {...checkbox}
                  headerRenderer={this.headerRenderer}
                  label={checkbox.label}
                  dataKey={checkbox.dataKey}
                  className={classes.flexContainer}
                  cellRenderer={this.checkboxRenderer}
                  width={checkbox.width}
                /> || null
              }
              {columns.map(({ label, dataKey, flexGrow = 1, width = 110, ...columnProps }) => {
                return (
                  <Column
                    key={dataKey}
                    headerRenderer={this.headerRenderer}
                    className={classes.flexContainer}
                    cellRenderer={this.cellRenderer}
                    label={label}
                    dataKey={dataKey}
                    flexGrow={flexGrow}
                    width={width}
                    {...columnProps}
                  />
                );
              })}
              {
                columns.length && actions &&
                <Column
                  {...actions}
                  headerRenderer={this.headerRenderer}
                  label={actions.label}
                  dataKey={actions.dataKey}
                  className={classes.flexContainer}
                  cellRenderer={this.menuRenderer}
                  width={actions.width}
                /> || null
              }
            </Table>
          )}
        </AutoSizer>
      </>
    );
  }
}

export default withStyles(styles)(VirtualizedTable);

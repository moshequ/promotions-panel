import React from 'react';
import usePromotions from "./usePromotions";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import VirtualizedTable from "./VirtualizedTable/VirtualizedTable";
import EditPromotion from "./EditPromotion";

// TODO: use InfiniteLoader (https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md)
const PromotionList = () => {
  const [edit, setEdit] = React.useState(null);
  const { promotions, columns, hasMore, loading, error, dispatch, setLastId } = usePromotions()

  // TODO: analyze performance, potentially, take advantage of useMemo/useCallback TBD
  const checkbox = { label: 'Select', dataKey: '_id', width: 80 }
  const actions = { label: 'Actions', dataKey: '_id', width: 80 }
  const columnsObj = columns.map(col => ({ label: col, dataKey: col, width: 110 }))
  const rowGetter = ({ index }) => promotions[index]
  const handleReset = () => dispatch({ type: 'RESET' })
  const handleEdit = (payload) => {
    setEdit(null)
    payload && dispatch({ type: 'EDIT', payload })
  }
  const openDialog = ({ rowData }) => setEdit(rowData)
  const handleDelete = ({ payload = [] }) => payload.length && dispatch({ type: 'DELETE', payload })
  const handleDuplicate = ({ payload = [] }) => payload.length && dispatch({ type: 'DUPLICATE', payload })

  return (
    <div className="box">
      <EditPromotion edit={edit} onEdit={handleEdit}/>

      <VirtualizedTable
        loading={loading}
        rowCount={promotions.length}
        rowGetter={rowGetter}
        columns={columnsObj}
        actions={actions}
        checkbox={checkbox}
        onEdit={openDialog}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />

      {
        (!promotions.length && !loading) &&
        <Button variant="contained" color="primary" style={{ margin: 16 }} onClick={handleReset}>
          Load data
        </Button>
      }

      <Snackbar open={Boolean(error)} message={error}/>
    </div>
  );
}

export default PromotionList


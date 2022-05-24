import React, { memo } from 'react'
import isEqual from 'lodash/isEqual';
import Cell from '../Cell';
import "./index.css"

const Row = ({
  x,
  y,
  rowData,
  addRows,
  setData,
  executeFormula = ({x,y}, val) => ({}),
  addColumns,
  sortColumnWise,
}) => {
  const handleChangedCells = (x, y, value) => {
    setData(prevData => {
      const modifiedData = [...prevData];
      if (!modifiedData[x])
        modifiedData[x] = [];
  
      modifiedData[x][y] = value;
      return modifiedData;
    })
  };

  const renderColumns = () => {
    const columns = [];

    for (let i = 0; i < y; i++) {
      columns.push(
        <Cell
          key={`${x}-${i}`}
          x={x}
          y={i}
          onChangedValue={handleChangedCells}
          value={rowData[i] || ''}
          addRows={addRows}
          addColumns={addColumns}
          sortColumnWise={sortColumnWise}
          executeFormula={executeFormula}
        />)
    }

    return columns;
  }

  return (
    <tr className="row">
      {renderColumns()}
    </tr>
  )
}

const compareFun = (prevProps, nextProps) => {
  if(isEqual(prevProps.rowData, nextProps.rowData)) {
    return true;
  }
  return false;
}

export default memo(Row, compareFun)
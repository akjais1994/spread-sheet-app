import React from 'react'
import Cell from '../Cell';
import "./index.css"

const Row = ({
  x,
  y,
  rowData,
  handleChangedCells,
  addRows,
  addColumns,
  sortColumnWise,
}) => {

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

export default Row
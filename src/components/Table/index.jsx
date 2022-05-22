import React, { useState } from 'react'
import Row from './Row';
import './index.css';

/**
 * @param {Object} props props for table component
 * @param {number} props.x number of rows
 * @param {number} props.y number of columns
 */

const Table = ({ x = 20, y = 20 }) => {

  const [data, setData] = useState([...Array(x)].map(() => Array(y)));
  const [rows, setRows] = useState(x);
  const [columns, setColumns] = useState(y);

  const handleChangedCells = (x, y, value) => {
    const modifiedData = [...data];
    if (!modifiedData[x])
      modifiedData[x] = [];

    modifiedData[x][y] = value;
    setData(modifiedData);
  }

  const addRows = x => {
    setRows(prev => prev + 1);
    // @ts-ignore
    setData(prev => {
      const modifiedData = [...prev];
      modifiedData.splice(x, 0, Array(y));
      return modifiedData;
    });
  }

  const addColumns = y => {
    setColumns(prev => prev + 1);
    // @ts-ignore
    setData(prev => {
      const modifiedData = [...prev];
      return modifiedData.map((row, i) => {
        const currentRow = [...row];
        currentRow.splice(y, 0, null);
        return currentRow;
      });
    });
  }

  const sortColumnWise = (y, ascendingOrder = true) => {
    setData(prev => {
      const modifiedData = [...prev.slice(1)];

      modifiedData.sort((a, b) => {
        if (a[y] > b[y]) {
          return ascendingOrder ? 1 : -1;
        }
        if (a[y] < b[y]) {
          return ascendingOrder ? -1 : 1;
        }
        return 0;
      });

      modifiedData.unshift(prev[0]);
      return modifiedData;
    });
  }

  const renderRows = () => {
    const rowsArr = [];

    for (let i = 0; i < rows + 1; i++) {
      const rowData = data[i] || [];
      const row = <Row
        x={i}
        y={columns + 1}
        key={i}
        rowData={rowData}
        handleChangedCells={handleChangedCells}
        addRows={addRows}
        addColumns={addColumns}
        sortColumnWise={sortColumnWise}
      />;
      if (i === 0) {
        rowsArr.push(<thead key={i}>{row}</thead>);
      } else {
        rowsArr.push(<tbody key={i}>{row}</tbody>);
      }
    }
    return rowsArr;
  }

  return (
    <table>
      {renderRows()}
    </table>

  )
}

export default Table

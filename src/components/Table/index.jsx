import { Parser } from 'hot-formula-parser';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isNumeric } from '../utils';
import './index.css';
import Row from './Row';

/**
 * @param {Object} props props for table component
 * @param {number} props.x number of rows
 * @param {number} props.y number of columns
 */

let currentY;
const Table = ({ x = 20, y = 20 }) => {

  const [data, setData] = useState([...Array(x)].map(() => Array(y)));
  const [rows, setRows] = useState(x);
  const [columns, setColumns] = useState(y);
  const parser = useMemo(() => new Parser(), []);

  const addRows = useCallback(x => {
    setRows(prev => prev + 1);
    // @ts-ignore
    setData(prev => {
      const modifiedData = [...prev];
      modifiedData.splice(x, 0, Array(y));
      return modifiedData;
    });
  }, [y]);

  const addColumns = useCallback(y => {
    setColumns(prev => prev + 1);
    currentY = y;
  }, []);

  useEffect(() => {
    if (currentY) {
      setData(prev => {
        const modifiedData = [...prev];
        return modifiedData.map((row) => {
          const currentRow = [...row];
          currentRow.splice(currentY, 0, null);
          return currentRow;
        });
      });
    }
  }, [columns])

  parser.on('callCellValue', (cellCoord, done) => {
    const x = cellCoord.row.index + 1;
    const y = cellCoord.column.index + 1;

    // Check if I have that coordinates tuple in the table range
    if (x > rows || y > columns) {
      throw parser.Error(parser.ERROR_NOT_AVAILABLE);
    }

    // Check that the cell is not self referencing
    if (parser.cell.x === x && parser.cell.y === y) {
      throw parser.Error(parser.ERROR_REF);
    }

    if (!data[x] || !data[x][y]) {
      return done('');
    }

    // All fine
    return done(data[x][y])
  });

  parser.on('callRangeValue',
    (startCellCoord, endCellCoord, done) => {
      const sx = startCellCoord.row.index + 1
      const sy = startCellCoord.column.index + 1
      const ex = endCellCoord.row.index + 1
      const ey = endCellCoord.column.index + 1
      const fragment = []

      for (let x = sx; x <= ex; x += 1) {
        const row = data[x]
        if (!row) {
          continue
        }

        const colFragment = []

        for (let y = sy; y <= ey; y += 1) {
          let value = row[y]
          if (!value) {
            value = ''
          }

          if (value.slice(0, 1) === '=') {
            const res = executeFormula({ x, y },
              value.slice(1));
            if (res.error) {
              throw parser.Error(res.error)
            }
            value = res.result
          }

          colFragment.push(value);
        }
        fragment.push(colFragment);
      }

      if (fragment) {
        done(fragment);
      }
    });

  const sortColumnWise = useCallback((y, ascendingOrder = true) => {
    setData(prev => {
      const modifiedData = [...prev.slice(1)];

      modifiedData.sort((a, b) => {
        if (!a[y])
          return 1;

        if (!b[y])
          return -1;

        if (isNumeric(a[y])) {
          a[y] = Number(a[y]);
        }
        if (isNumeric(b[y])) {
          b[y] = Number(b[y]);
        }
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
  }, []);

  const executeFormula = useCallback((cellCoord, cellVal) => {
    parser.cell = cellCoord;
    let res = parser.parse(cellVal);
    if (res.error != null) {
      return res // tip: returning `res.error` shows more details
    }

    if (res.result.toString() === '') {
      return res;
    }

    if (res.result.toString().slice(0, 1) === '=') {
      // formula points to formula
      res = executeFormula(cellCoord, res.result.slice(1))
    }

    return res;
  }, [parser])

  const renderRows = () => {
    const rowsArr = [];

    for (let i = 0; i < rows; i++) {
      const rowData = [...data[i]] || [];
      const row = <Row
        x={i}
        y={columns + 1}
        key={i}
        rowData={rowData}
        addRows={addRows}
        executeFormula={executeFormula}
        setData={setData}
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

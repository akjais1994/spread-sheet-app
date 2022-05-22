import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ROW_HEADER_VALUES } from '../constants';
import './index.css';
import classNames from 'classnames';
import ContextMenu from '../../ContextMenu';

let timer;
let allowed = true;
const Cell = ({
  x,
  y,
  onChangedValue,
  value,
  addRows,
  addColumns,
  sortColumnWise,
}) => {
  const [editable, setEditable] = useState(false);
  const [cellValue, setCellValue] = useState(value);
  const [selected, setSelected] = useState(false);
  const cellRef = useRef(null);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const ROW_HEADER_VALUES_ARR = ROW_HEADER_VALUES.split('');

  const getContextMenu = () =>
    showTooltip ?
      <ContextMenu
        setShow={setShowTooltip}
        anchorPointX={anchorPoint.x}
        anchorPointY={anchorPoint.y}
        x={x}
        y={y}
        addRows={addRows}
        addColumns={addColumns}
        sortColumnWise={sortColumnWise}
      /> : null;

  useEffect(() => {
    setCellValue(value);
  }, [value]);

  const handleSingleClickOnCell = () => {
    timer = setTimeout(() => {
      if (allowed) {
        console.log('single click called', x, y);
        broadcastUnselectAllEvent();
        setSelected(true);
      }
      allowed = true;
    }, 200);
  }

  const handledbClickOnCell = () => {
    clearTimeout(timer);
    allowed = false;
    console.log("🚀 ~ file: index.jsx ~ line 41 ~ handledbClickOnCell ~ handledbClickOnCell", x, y);
    broadcastUnselectAllEvent();
    setSelected(true);
    setEditable(true);
  }

  const handleBlur = e => {
    onChangedValue(x, y, e.target.value);
    setEditable(false);
  }

  const handleInputChange = e => {
    setCellValue(e.target.value);
  }

  const handleKeyDownOnInput = e => {
    if (e.key === 'Enter') {
      onChangedValue(x, y, e.target.value);
      setEditable(false);
    }
  }

  const broadcastUnselectAllEvent = () => {
    console.log("🚀 ~ file: index.jsx ~ line 61 ~ broadcastUnselectAllEvent ~ broadcastUnselectAllEvent")
    const unselectEvent = new Event('unselectAll');
    window.document.dispatchEvent(unselectEvent);
  }

  const handleUnSelectAll = e => {
    // console.log(`x - ${x}, y - ${y}, ~ editable`, editable)
    // console.log(`x - ${x}, y - ${y}, ~ selected`, selected)
    // if (selected || editable) {
    setEditable(false);
    setSelected(false);
    // }
  };

  const handleContextMenuEvent = useCallback(e => {
    console.log('handleContextMenuEvent');
    e.preventDefault();
    setAnchorPoint({ x: e.pageX, y: e.pageY });
    setShowTooltip(true);
  }, [setAnchorPoint]);

  useEffect(() => {
    window.document.addEventListener('unselectAll', handleUnSelectAll);
    if (cellRef && cellRef.current) {
      // @ts-ignore
      cellRef.current.addEventListener('contextmenu', handleContextMenuEvent);
    }
    return () => {
      window.document.removeEventListener('unselectAll', handleUnSelectAll);
      if (cellRef && cellRef.current) {
        // @ts-ignore
        // eslint-disable-next-line react-hooks/exhaustive-deps
        cellRef.current.removeEventListener('contextmenu', handleContextMenuEvent);
      }
    }
  }, [cellRef, handleContextMenuEvent]);

  const renderView = () => {
    // First Column
    if (y === 0) {
      return <td ref={cellRef} className={classNames('cell', 'header')}>{x}</td>
    }

    //first row
    if (x === 0) {
      return (
        <th
          className={classNames('cell', 'header')}
          role="presentation"
          ref={cellRef}
        >
          {ROW_HEADER_VALUES_ARR[y]}
        </th>)
    }

    if (editable) {
      return <input
        className={classNames("cell", {
          'selected': selected,
        })}
        onBlur={handleBlur}
        onChange={handleInputChange}
        value={cellValue}
        onKeyPress={handleKeyDownOnInput}
        autoFocus
        ref={cellRef}
      />
    }

    return (<>
      <td
        onClick={handleSingleClickOnCell}
        onDoubleClick={handledbClickOnCell}
        className={classNames("cell", {
          'selected': selected,
        })}
        role="presentation"
        ref={cellRef}
      >
        {cellValue}
      </td>

    </>
    )
  }

  return (
    <>
      {renderView()}
      {getContextMenu()}
    </>
  )
}

export default Cell;
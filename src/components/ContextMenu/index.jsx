import React, { useCallback, useEffect, useRef } from 'react'
import './index.css';

const ContextMenu = ({
  setShow,
  anchorPointX,
  anchorPointY,
  x,
  y,
  addRows,
  addColumns,
  sortColumnWise,
}) => {
  const menuRef = useRef(null);
  const backdropRef = useRef(null);

  const closeContextMenu = useCallback(e => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShow(false);
    }
  }, [setShow]);

  useEffect(() => {
    if (backdropRef && backdropRef.current) {
      backdropRef.current.addEventListener('click', closeContextMenu, true);
    }

    return () => {
      if (backdropRef && backdropRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        backdropRef.current.removeEventListener('click', closeContextMenu, true);
      }
    }
  }, [backdropRef, closeContextMenu])

  const addRowAbove = e => {
    addRows(x);
    setShow(false);
  }

  function addRowBelow(e) {
    addRows(x + 1);
    setShow(false);
  }

  function addColumnsLeft(e) {
    addColumns(y);
    setShow(false);
  }

  function addColumnsRight(e) {
    addColumns(y + 1);
    setShow(false);
  }

  return (
    <div
      className="menuContainer"
      ref={backdropRef}
    >
      <ul
        ref={menuRef}
        className="contextContainer"
        style={{
          top: anchorPointY,
          left: anchorPointX,
        }}>
        {x !== 0 ? <li onClick={addRowAbove} className="listItem">+ Insert 1 row above</li> : null}
        {y === 0 ? <li onClick={addRowBelow} className="listItem">+ Insert 1 row below</li> : null}
        {y !== 0 ? <li onClick={addColumnsLeft} className="listItem">+ Insert 1 columns left</li> : null}
        {x === 0 ? <li onClick={addColumnsRight} className="listItem">+ Insert 1 columns right</li> : null}
        {x === 0 ? <li onClick={() => { sortColumnWise(y); setShow(false); }} className="listItem">Sort Sheet A to Z</li> : null}
        {x === 0 ? <li onClick={() => { sortColumnWise(y, false); setShow(false); }} className="listItem">Sort Sheet Z to A</li> : null}
      </ul>
    </div>
  )
}

export default ContextMenu;

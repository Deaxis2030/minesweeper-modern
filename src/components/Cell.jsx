import React from 'react';
import { CELL_STATES } from '../constants';

const Cell = ({ cell, onClick, onRightClick, onDoubleClick }) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
    onRightClick();
  };

  let content = '';
  let className = 'cell';

  if (cell.state === CELL_STATES.FLAGGED) {
    content = '🚩';
    className += ' flagged';
  } else if (cell.state === CELL_STATES.REVEALED) {
    if (cell.isMine) {
      content = cell.wasClicked ? '💥' : '💣';
      className += ' mine';
      if (cell.wasClicked) className += ' exploded';
    } else if (cell.adjacentMines > 0) {
      content = cell.adjacentMines;
      className += ` number-${cell.adjacentMines}`;
    }
  }

  return (
    <div
      className={className}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={onDoubleClick}
    >
      {content}
    </div>
  );
};

export default Cell;

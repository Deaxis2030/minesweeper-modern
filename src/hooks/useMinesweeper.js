import { useState, useCallback, useEffect } from 'react';

const CELL_STATES = {
  HIDDEN: 'hidden',
  REVEALED: 'revealed',
  FLAGGED: 'flagged',
};

const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

function generateBoard(rows, cols, mines, safeRow = null, safeCol = null) {
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      adjacentMines: 0,
      state: CELL_STATES.HIDDEN,
      wasClicked: false,
    }))
  );

  // Place mines, avoiding the safe first click area
  let minesPlaced = 0;
  const safeZone = new Set();
  if (safeRow !== null && safeCol !== null) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = safeRow + dr;
        const c = safeCol + dc;
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          safeZone.add(`${r},${c}`);
        }
      }
    }
  }

  while (minesPlaced < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    const key = `${r},${c}`;

    if (!board[r][c].isMine && !safeZone.has(key)) {
      board[r][c].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate adjacent mines
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;

      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
            count++;
          }
        }
      }
      board[r][c].adjacentMines = count;
    }
  }

  return board;
}

function revealCell(board, row, col) {
  const newBoard = board.map(r => r.map(cell => ({ ...cell })));
  const cell = newBoard[row][col];

  if (cell.state !== CELL_STATES.HIDDEN) return { newBoard, hitMine: false };

  cell.state = CELL_STATES.REVEALED;
  cell.wasClicked = true;

  let hitMine = false;
  if (cell.isMine) {
    hitMine = true;
    return { newBoard, hitMine };
  }

  // Flood fill for empty cells
  if (cell.adjacentMines === 0) {
    const queue = [{ r: row, c: col }];
    while (queue.length > 0) {
      const { r, c } = queue.shift();
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < newBoard.length && nc >= 0 && nc < newBoard[0].length) {
            const neighbor = newBoard[nr][nc];
            if (neighbor.state === CELL_STATES.HIDDEN && !neighbor.isMine) {
              neighbor.state = CELL_STATES.REVEALED;
              if (neighbor.adjacentMines === 0) {
                queue.push({ r: nr, c: nc });
              }
            }
          }
        }
      }
    }
  }

  return { newBoard, hitMine };
}

function flagCell(board, row, col, maxMines) {
  const cell = board[row][col];

  if (cell.state === CELL_STATES.HIDDEN && getFlaggedCount(board) >= maxMines) {
    return board;
  }

  const newBoard = board.map(r => r.map(c => ({ ...c })));
  const newCell = newBoard[row][col];

  if (newCell.state === CELL_STATES.HIDDEN) {
    newCell.state = CELL_STATES.FLAGGED;
  } else if (newCell.state === CELL_STATES.FLAGGED) {
    newCell.state = CELL_STATES.HIDDEN;
  }

  return newBoard;
}

function checkWin(board) {
  let revealedSafe = 0;
  let totalSafe = 0;

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      const cell = board[r][c];
      if (!cell.isMine) {
        totalSafe++;
        if (cell.state === CELL_STATES.REVEALED) revealedSafe++;
      }
    }
  }

  return revealedSafe === totalSafe;
}

function getFlaggedCount(board) {
  let count = 0;
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (board[r][c].state === CELL_STATES.FLAGGED) count++;
    }
  }
  return count;
}

function chordReveal(board, row, col) {
  const cell = board[row][col];

  if (cell.state !== CELL_STATES.REVEALED || cell.adjacentMines === 0) {
    return { newBoard: board, hitMine: false, changed: false };
  }

  let flagCount = 0;
  const hiddenNeighbors = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) {
        const neighbor = board[nr][nc];
        if (neighbor.state === CELL_STATES.FLAGGED) {
          flagCount++;
        } else if (neighbor.state === CELL_STATES.HIDDEN) {
          hiddenNeighbors.push({ r: nr, c: nc });
        }
      }
    }
  }

  if (flagCount !== cell.adjacentMines || hiddenNeighbors.length === 0) {
    return { newBoard: board, hitMine: false, changed: false };
  }

  let currentBoard = board;
  let hitMine = false;

  for (const { r, c } of hiddenNeighbors) {
    const result = revealCell(currentBoard, r, c);
    currentBoard = result.newBoard;
    if (result.hitMine) {
      hitMine = true;
      break;
    }
  }

  return { newBoard: currentBoard, hitMine, changed: true };
}

export default function useMinesweeper(initialDifficulty = 'expert') {
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const config = DIFFICULTIES[difficulty];
  const [board, setBoard] = useState(() => generateBoard(config.rows, config.cols, config.mines));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [timer, setTimer] = useState(0);
  const [isTiming, setIsTiming] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(config.mines);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTiming && !gameOver && !won) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTiming, gameOver, won]);

  const resetGame = useCallback((newDifficulty = difficulty) => {
    const newConfig = DIFFICULTIES[newDifficulty];
    const newBoard = generateBoard(newConfig.rows, newConfig.cols, newConfig.mines);
    setBoard(newBoard);
    setGameOver(false);
    setWon(false);
    setFirstClick(true);
    setTimer(0);
    setIsTiming(false);
    setFlagsLeft(newConfig.mines);
    setDifficulty(newDifficulty);
  }, [difficulty]);

  const handleClick = useCallback((row, col) => {
    if (gameOver || won) return;

    let currentBoard = board;

    if (firstClick) {
      currentBoard = generateBoard(config.rows, config.cols, config.mines, row, col);
      setFirstClick(false);
      setIsTiming(true);
    }

    const result = revealCell(currentBoard, row, col);
    const newBoard = result.newBoard;
    const hitMine = result.hitMine;

    setBoard(newBoard);

    if (hitMine) {
      setGameOver(true);
      setIsTiming(false);
      // Reveal all mines on loss
      const finalBoard = newBoard.map(r =>
        r.map(cell => {
          if (cell.isMine) return { ...cell, state: CELL_STATES.REVEALED };
          return cell;
        })
      );
      setBoard(finalBoard);
    } else if (checkWin(newBoard)) {
      setWon(true);
      setIsTiming(false);
    }

    setFlagsLeft(config.mines - getFlaggedCount(newBoard));
  }, [board, firstClick, gameOver, won, config]);

  const handleRightClick = useCallback((row, col) => {
    if (gameOver || won || firstClick) return;

    const newBoard = flagCell(board, row, col, config.mines);
    if (newBoard === board) return;

    setBoard(newBoard);
    setFlagsLeft(config.mines - getFlaggedCount(newBoard));
  }, [board, gameOver, won, firstClick, config]);

  const handleDoubleClick = useCallback((row, col) => {
    if (gameOver || won || firstClick) return;

    const result = chordReveal(board, row, col);
    if (!result.changed) return;

    const { newBoard, hitMine } = result;

    setBoard(newBoard);

    if (hitMine) {
      setGameOver(true);
      setIsTiming(false);
      const finalBoard = newBoard.map(r =>
        r.map(cell => {
          if (cell.isMine) return { ...cell, state: CELL_STATES.REVEALED };
          return cell;
        })
      );
      setBoard(finalBoard);
    } else if (checkWin(newBoard)) {
      setWon(true);
      setIsTiming(false);
    }

    setFlagsLeft(config.mines - getFlaggedCount(newBoard));
  }, [board, gameOver, won, firstClick, config]);

  const changeDifficulty = useCallback((newDifficulty) => {
    resetGame(newDifficulty);
  }, [resetGame]);

  return {
    board,
    gameOver,
    won,
    timer,
    flagsLeft,
    difficulty,
    handleClick,
    handleRightClick,
    handleDoubleClick,
    resetGame,
    changeDifficulty,
    config,
  };
}

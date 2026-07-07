import React from 'react';
import useMinesweeper from './hooks/useMinesweeper';
import Board from './components/Board';
import Header from './components/Header';
import './index.css';

function App() {
  const {
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
  } = useMinesweeper('beginner');

  return (
    <div className="app">
      <h1>Modern Minesweeper</h1>
      <p className="subtitle">Classic rules • Modern feel • Themes coming soon</p>

      <Header
        flagsLeft={flagsLeft}
        timer={timer}
        onReset={resetGame}
        difficulty={difficulty}
        onChangeDifficulty={changeDifficulty}
        gameOver={gameOver}
        won={won}
      />

      <Board
        board={board}
        onCellClick={handleClick}
        onCellRightClick={handleRightClick}
        onCellDoubleClick={handleDoubleClick}
      />

      {(gameOver || won) && (
        <div className={`game-status ${won ? 'win' : 'lose'}`}>
          {won ? '🎉 You Win!' : '💥 Game Over'}
          <button onClick={resetGame} className="play-again-btn">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

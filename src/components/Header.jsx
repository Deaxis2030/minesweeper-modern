import React from 'react';

const Header = ({ flagsLeft, timer, onReset, difficulty, onChangeDifficulty, gameOver, won }) => {
  const face = won ? '😎' : gameOver ? '😵' : '🙂';

  return (
    <div className="header">
      <div className="header-bar">
        <div className="counter" aria-label={`${flagsLeft} flags remaining`}>
          {String(flagsLeft).padStart(3, '0')}
        </div>

        <button onClick={onReset} className="face-btn" aria-label="Reset game">
          {face}
        </button>

        <div className="counter" aria-label={`${timer} seconds elapsed`}>
          {String(Math.min(timer, 999)).padStart(3, '0')}
        </div>
      </div>

      <select
        value={difficulty}
        onChange={(e) => onChangeDifficulty(e.target.value)}
        className="difficulty-select"
      >
        <option value="beginner">Beginner (9×9)</option>
        <option value="intermediate">Intermediate (16×16)</option>
        <option value="expert">Expert (30×16)</option>
      </select>
    </div>
  );
};

export default Header;

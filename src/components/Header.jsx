import React from 'react';

const Header = ({ flagsLeft, timer, onReset, difficulty, onChangeDifficulty }) => {
  return (
    <div className="header">
      <div className="stats">
        <span>🚩 {flagsLeft}</span>
        <span>⏱ {timer}</span>
      </div>

      <div className="controls">
        <select 
          value={difficulty} 
          onChange={(e) => onChangeDifficulty(e.target.value)}
          className="difficulty-select"
        >
          <option value="beginner">Beginner (9×9)</option>
          <option value="intermediate">Intermediate (16×16)</option>
          <option value="expert">Expert (30×16)</option>
        </select>

        <button onClick={onReset} className="reset-btn">
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

export default Header;

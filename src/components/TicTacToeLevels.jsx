/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./TicTacToe.css"; // Importing custom CSS for styling

const TicTacToeLevels = () => {
  const [size, setSize] = useState(3);
  const [board, setBoard] = useState(Array(size * size).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setBoard(Array(size * size).fill(null));
    setXIsNext(true);
    setTime(0);
  }, [size]);

  const generateWinningLines = (n) => {
    const lines = [];
    console.log(`Generating winning lines for a ${n}x${n} grid`);

    // Rows
    for (let i = 0; i < n; i++) {
      const row = [];
      console.log(`Generating row ${i}`);
      for (let j = 0; j < n; j++) {
        const index = i * n + j;
        console.log(`Row ${i}, adding index ${index}`);
        row.push(index);
      }
      lines.push(row);
      console.log(`Completed row ${i}:`, row);
    }

    // Columns
    for (let i = 0; i < n; i++) {
      const col = [];
      console.log(`Generating column ${i}`);
      for (let j = 0; j < n; j++) {
        const index = j * n + i;
        console.log(`Column ${i}, adding index ${index}`);
        col.push(index);
      }
      lines.push(col);
      console.log(`Completed column ${i}:`, col);
    }

    // Diagonals
    const diag1 = [];
    const diag2 = [];
    console.log("Generating diagonals");
    for (let i = 0; i < n; i++) {
      const index1 = i * n + i;
      const index2 = i * n + (n - i - 1);
      console.log(`Diagonal 1, adding index ${index1}`);
      console.log(`Diagonal 2, adding index ${index2}`);
      diag1.push(index1);
      diag2.push(index2);
    }
    lines.push(diag1);
    lines.push(diag2);
    console.log("Completed diagonals:", diag1, diag2);

    return lines;
  };

  const calculateWinner = (squares, n) => {
    const lines = generateWinningLines(n);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (
        line.every(
          (index) => squares[index] && squares[index] === squares[line[0]]
        )
      ) {
        return squares[line[0]];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (calculateWinner(board, size) || board[i]) {
      return;
    }
    const newBoard = [...board];
    newBoard[i] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(board, size);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (board.every((square) => square !== null)) {
    status = "It's a draw";
  } else {
    status = `Next Player: ${xIsNext ? "X" : "O"}`;
  }

  const resetGame = () => {
    setBoard(Array(size * size).fill(null));
    setXIsNext(true);
    setTime(0);
  };

  const changeLevel = (level) => {
    switch (level) {
      case 1:
        setSize(3);
        break;
      case 2:
        setSize(4);
        break;
      case 3:
        setSize(5);
        break;
      default:
        setSize(3);
    }
  };

  return (
    <div className="game-container">
      <div className="header">
        <h1 className="gameName">Tic Tac Toe</h1>
        <div className="status">{status}</div>
        <div className="timer">Time: {time}s</div>
      </div>
      <div className="level-buttons">
        <button onClick={() => changeLevel(1)}>Level 1 (3x3)</button>
        <button onClick={() => changeLevel(2)}>Level 2 (4x4)</button>
        <button onClick={() => changeLevel(3)}>Level 3 (5x5)</button>
      </div>
      <div
        className="board"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {board.map((value, index) => (
          <button
            key={index}
            className="square"
            onClick={() => handleClick(index)}
          >
            {value}
          </button>
        ))}
      </div>
      <button className="reset-button" onClick={resetGame}>
        New Game
      </button>
    </div>
  );
};

export default TicTacToeLevels;

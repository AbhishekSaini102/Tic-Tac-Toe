/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

const TicTacToeNN = ({ size = 3 }) => {
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
    console.log("Current board state:", board);
    console.log("Next player:", xIsNext ? "X" : "O");
  }, [board, xIsNext]);

  useEffect(() => {
    setBoard(Array(size * size).fill(null));
    setXIsNext(true);
  }, [size]);

  const generateWinningLines = (n) => {
    const lines = [];

    // Rows
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        row.push(i * n + j);
      }
      lines.push(row);
    }

    // Columns
    for (let i = 0; i < n; i++) {
      const col = [];
      for (let j = 0; j < n; j++) {
        col.push(j * n + i);
      }
      lines.push(col);
    }

    // Diagonals
    const diag1 = [];
    const diag2 = [];
    for (let i = 0; i < n; i++) {
      diag1.push(i * n + i);
      diag2.push(i * n + (n - i - 1));
    }
    lines.push(diag1);
    lines.push(diag2);

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

  return (
    <div className="flex flex-col items-center border-black rounded-lg">
      <div className="mb-4 mt-2 text-2xl font-bold">Tic Tac Toe</div>
      <div className="mb-4 text-2xl font-bold">{status}</div>
      <div className="mb-4 text-xl">Time: {time}s</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: "0.2rem",
        }}
        className="bg-white p-4 rounded-lg shadow-md"
      >
        {board.map((value, index) => (
          <button
            key={index}
            className="w-20 h-20 border border-gray-400 text-4xl font-bold focus:outline-none"
            onClick={() => handleClick(index)}
          >
            {value}
          </button>
        ))}
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white text-sm p-2 rounded-lg focus:outline-none mt-4"
        onClick={resetGame}
      >
        New Game
      </button>
    </div>
  );
};

export default TicTacToeNN;

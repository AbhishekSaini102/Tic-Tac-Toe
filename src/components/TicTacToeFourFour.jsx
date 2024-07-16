/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

const TicTacToeFourFour = () => {
  const [board, setBoard] = useState(Array(16).fill(null)); // 4x4 board
  const [xIsNext, setXIsNext] = useState(true);

  useEffect(() => {
    console.log("Current board state:", board);
    console.log("Next player:", xIsNext ? "X" : "O");
  }, [board, xIsNext]);

  const calculateWinner = (squares) => {
    const lines = [
      // Rows
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [12, 13, 14, 15],
      // Columns
      [0, 4, 8, 12],
      [1, 5, 9, 13],
      [2, 6, 10, 14],
      [3, 7, 11, 15],
      // Diagonals
      [0, 5, 10, 15],
      [3, 6, 9, 12],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c, d] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c] &&
        squares[a] === squares[d]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (calculateWinner(board) || board[i]) {
      return;
    }
    const newBoard = [...board];
    newBoard[i] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(board);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (board.every((square) => square !== null)) {
    status = "It's a draw";
  } else {
    status = `Next Player ${xIsNext ? "X" : "O"}`;
  }

  const resetGame = () => {
    setBoard(Array(16).fill(null)); // Reset to 4x4 board
    setXIsNext(true);
  };

  return (
    <div className="flex flex-col items-center border-black rounded-lg">
      <div className="mb-4 text-2xl font-bold">Tic Tac Toe</div>
      <div className="mb-4 text-2xl font-bold">{status}</div>
      <div className="grid grid-cols-4 gap-1 bg-white p-4 rounded-lg shadow-md">
        {" "}
        {/* 4 columns for 4x4 grid */}
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

export default TicTacToeFourFour;

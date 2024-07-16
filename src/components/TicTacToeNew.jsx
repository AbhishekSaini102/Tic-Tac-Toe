/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

const TicTacToeNew = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  useEffect(() => {
    console.log("Current board state:", board);
    console.log("Next player:", xIsNext ? "X" : "O");
  }, [board, xIsNext]);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      // console.log("value of i:", i);
      // console.log("Value in square for checking :", squares[a], squares[b], squares[c]);
      // console.log("Winning line (actual winning combination):", a, b, c);
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[b] === squares[c]
      ) {
        // console.log("Winner found:", squares[a]);
        return squares[a];
      }
    }
    // console.log("No winner yet");
    return null;
  };

  const handleClick = (i) => {
    // console.log("Square clicked:", i);
    if (calculateWinner(board) || board[i]) {
      // console.log("calculateWinner(board) value:", calculateWinner(board));
      // console.log("board[i] value:", board[i]);
      // console.log("Invalid move, square already filled or game over");
      return;
    }
    const newBoard = [...board];
    console.log("New board created:", newBoard);
    
    console.log(`Before update: xIsNext=${xIsNext}, newBoard=${newBoard}`);

    newBoard[i] = xIsNext ? "X" : "O";

    console.log(`After update: xIsNext=${xIsNext}, newBoard=${newBoard}`);

    console.log("Updated board:", newBoard);
    console.log("Square filled with:", newBoard[i]);
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(board);
  console.log("Winner:", winner);
  console.log("calculateWinner(board):", calculateWinner(board));
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (board.every((square) => square !== null)) {
    status = "It's a draw";
  } else {
    status = `Next Player ${xIsNext ? "X" : "O"}`;
  }
  console.log("Game status:", status);

  const resetGame = () => {
    console.log("Game reset");
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };
   
  
  
  return (
    <div className="flex flex-col items-center border-black rounded-lg">
      <div className="mb-4 text-2xl font-bold">Tic Tac Toe</div>
      <div className="mb-4 text-2xl font-bold">{status}</div>
      <div className="grid grid-cols-3 gap-1 bg-white p-4 rounded-lg shadow-md">
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

export default TicTacToeNew;

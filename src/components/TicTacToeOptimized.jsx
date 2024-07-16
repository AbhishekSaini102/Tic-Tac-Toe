import { useState, useEffect, useCallback, useMemo } from "react";

const TicTacToeNew = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  useEffect(() => {
    console.log("Current board state:", board);
    console.log("Next player:", xIsNext ? "X" : "O");
  }, [board, xIsNext]);

  const calculateWinner = useCallback((squares) => {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[b] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }, []);

  const handleClick = useCallback((i) => {
      if (calculateWinner(board) || board[i]) {
        return;
      }
      const newBoard = [...board];
      console.log(`Before update: xIsNext=${xIsNext}, newBoard=${newBoard}`);
      newBoard[i] = xIsNext ? "X" : "O";
      console.log(`After update: xIsNext=${xIsNext}, newBoard=${newBoard}`);
      console.log("Square filled with:", newBoard[i]);
      setBoard(newBoard);
      setXIsNext((prev) => !prev);
    },
    [board, xIsNext, calculateWinner]
  );

  const winner = useMemo(() => calculateWinner(board),
    [board, calculateWinner]
  );

  const status = useMemo(() => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (board.every((square) => square !== null)) {
      return "It's a draw";
    } else {
      return `Next Player ${xIsNext ? "X" : "O"}`;
    }
  }, [board, winner, xIsNext]);

  useEffect(() => {
    console.log("Winner:", winner);
    console.log("Game status:", status);
  }, [winner, status]);

  const resetGame = useCallback(() => {
    console.log("Game reset");
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }, []);

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

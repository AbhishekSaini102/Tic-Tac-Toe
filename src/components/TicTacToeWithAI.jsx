import { useState, useEffect, useCallback, useMemo } from "react";

const TicTacToeWithAI = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [aiDifficulty, setAiDifficulty] = useState("medium");
  const [gameMode, setGameMode] = useState("player");

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

  const minimax = useCallback(
    (board, depth, isMaximizing, maxDepth = Infinity) => {
      const winner = calculateWinner(board);
      if (winner === "O") return 10 - depth;
      if (winner === "X") return depth - 10;
      if (board.every((square) => square !== null) || depth === maxDepth)
        return 0;

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = "O";
            const score = minimax(board, depth + 1, false, maxDepth);
            board[i] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = "X";
            const score = minimax(board, depth + 1, true, maxDepth);
            board[i] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
        return bestScore;
      }
    },
    [calculateWinner]
  );

  const findBestMove = useCallback(
    (board, maxDepth = Infinity) => {
      let bestScore = -Infinity;
      let bestMove;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = "O";
          const score = minimax(board, 0, false, maxDepth);
          board[i] = null;
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      }
      return bestMove;
    },
    [minimax]
  );

  const getRandomMove = useCallback((board) => {
    const availableMoves = board.reduce((acc, square, index) => {
      if (square === null) acc.push(index);
      return acc;
    }, []);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }, []);

  const getAIMove = useCallback(
    (board) => {
      switch (aiDifficulty) {
        case "easy":
          return getRandomMove(board);
        case "medium":
          // Medium now uses minimax with a depth limit of 2
          return findBestMove(board, 2);
        case "hard":
          return findBestMove(board);
        default:
          return getRandomMove(board);
      }
    },
    [aiDifficulty, findBestMove, getRandomMove]
  );

  const handleClick = useCallback(
    (i) => {
      if (calculateWinner(board) || board[i]) {
        return;
      }
      const newBoard = [...board];
      newBoard[i] = xIsNext ? "X" : "O";
      setBoard(newBoard);
      setXIsNext(!xIsNext);
    },
    [board, xIsNext, calculateWinner]
  );

  useEffect(() => {
    if (gameMode === "ai" && !xIsNext && !calculateWinner(board)) {
      const aiMove = getAIMove(board);
      setTimeout(() => handleClick(aiMove), 500);
    }
  }, [board, xIsNext, gameMode, getAIMove, handleClick, calculateWinner]);

  const winner = useMemo(
    () => calculateWinner(board),
    [board, calculateWinner]
  );

  const status = useMemo(() => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (board.every((square) => square !== null)) {
      return "It's a draw";
    } else {
      return `Next Player: ${xIsNext ? "X" : "O"}`;
    }
  }, [board, winner, xIsNext]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }, []);

  return (
    <div className="flex flex-col items-center border-black rounded-lg p-4">
      <div className="mb-2 text-2xl font-bold">Tic Tac Toe</div>
      <div className="mb-4">
        <button
          className={`px-2 py-1 mr-2 ${
            gameMode === "player" ? "bg-blue-500" : "bg-gray-300"
          }`}
          onClick={() => setGameMode("player")}
        >
          Player vs Player
        </button>
        <button
          className={`px-2 py-1 ${
            gameMode === "ai" ? "bg-blue-500" : "bg-gray-300"
          }`}
          onClick={() => setGameMode("ai")}
        >
          Player vs AI
        </button>
      </div>
      {gameMode === "ai" && (
        <div className="mb-4">
          <select
            value={aiDifficulty}
            onChange={(e) => setAiDifficulty(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}
      <div className="mb-4 text-xl font-bold">{status}</div>
      <div className="grid grid-cols-3 gap-1 bg-white p-4 rounded-lg shadow-md">
        {board.map((value, index) => (
          <button
            key={index}
            className="w-20 h-20 border border-gray-400 text-4xl font-bold focus:outline-none"
            onClick={() => handleClick(index)}
            disabled={value !== null || (gameMode === "ai" && !xIsNext)}
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

export default TicTacToeWithAI;

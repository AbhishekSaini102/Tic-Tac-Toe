// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect, useCallback, useMemo } from "react";

// const TicTacToeWithAI = () => {
//   const [board, setBoard] = useState(Array(9).fill(null));
//   const [xIsNext, setXIsNext] = useState(true);
//   const [aiDifficulty, setAiDifficulty] = useState("medium");
//   const [gameMode, setGameMode] = useState("player");
//   const [winningCombo, setWinningCombo] = useState(null);
//   const [isDraw, setIsDraw] = useState(false);
//   const [suggestionPoints, setSuggestionPoints] = useState(4);
//   const [showSuggestion, setShowSuggestion] = useState(false);

//   const calculateWinner = useCallback((squares) => {
//     const lines = [
//       [0, 1, 2],
//       [3, 4, 5],
//       [6, 7, 8],
//       [0, 3, 6],
//       [1, 4, 7],
//       [2, 5, 8],
//       [0, 4, 8],
//       [2, 4, 6],
//     ];
//     for (let i = 0; i < lines.length; i++) {
//       const [a, b, c] = lines[i];
//       if (
//         squares[a] &&
//         squares[a] === squares[b] &&
//         squares[b] === squares[c]
//       ) {
//         return { winner: squares[a], combo: [a, b, c] };
//       }
//     }
//     return null;
//   }, []);

//   const minimax = useCallback(
//     (board, depth, isMaximizing, maxDepth = Infinity) => {
//       const result = calculateWinner(board);
//       if (result?.winner === "O") return 10 - depth;
//       if (result?.winner === "X") return depth - 10;
//       if (board.every((square) => square !== null) || depth === maxDepth)
//         return 0;

//       if (isMaximizing) {
//         let bestScore = -Infinity;
//         for (let i = 0; i < 9; i++) {
//           if (board[i] === null) {
//             board[i] = "O";
//             const score = minimax(board, depth + 1, false, maxDepth);
//             board[i] = null;
//             bestScore = Math.max(score, bestScore);
//           }
//         }
//         return bestScore;
//       } else {
//         let bestScore = Infinity;
//         for (let i = 0; i < 9; i++) {
//           if (board[i] === null) {
//             board[i] = "X";
//             const score = minimax(board, depth + 1, true, maxDepth);
//             board[i] = null;
//             bestScore = Math.min(score, bestScore);
//           }
//         }
//         return bestScore;
//       }
//     },
//     [calculateWinner]
//   );

//   const findBestMove = useCallback(
//     (board, player) => {
//       let bestScore = player === "X" ? Infinity : -Infinity;
//       let bestMove;
//       for (let i = 0; i < 9; i++) {
//         if (board[i] === null) {
//           board[i] = player;
//           const score = minimax(board, 0, player === "X");
//           board[i] = null;
//           if (player === "X" ? score < bestScore : score > bestScore) {
//             bestScore = score;
//             bestMove = i;
//           }
//         }
//       }
//       return bestMove;
//     },
//     [minimax]
//   );

//   const getRandomMove = useCallback((board) => {
//     const availableMoves = board.reduce((acc, square, index) => {
//       if (square === null) acc.push(index);
//       return acc;
//     }, []);
//     return availableMoves[Math.floor(Math.random() * availableMoves.length)];
//   }, []);

//   const getAIMove = useCallback(
//     (board) => {
//       switch (aiDifficulty) {
//         case "easy":
//           return getRandomMove(board);
//         case "medium":
//           return findBestMove(board, "O");
//         case "hard":
//           return findBestMove(board, "O");
//         default:
//           return getRandomMove(board);
//       }
//     },
//     [aiDifficulty, findBestMove, getRandomMove]
//   );

//   const handleClick = useCallback(
//     (i) => {
//       if (calculateWinner(board) || board[i]) {
//         return;
//       }
//       const newBoard = [...board];
//       newBoard[i] = xIsNext ? "X" : "O";
//       setBoard(newBoard);
//       setXIsNext(!xIsNext);
//       setShowSuggestion(false);
//     },
//     [board, xIsNext, calculateWinner]
//   );

//   useEffect(() => {
//     const result = calculateWinner(board);
//     if (result) {
//       setWinningCombo(result.combo);
//     } else if (board.every((square) => square !== null)) {
//       setIsDraw(true);
//     } else {
//       setWinningCombo(null);
//       setIsDraw(false);
//     }

//     if (gameMode === "ai" && !xIsNext && !result && !isDraw) {
//       const aiMove = getAIMove(board);
//       setTimeout(() => handleClick(aiMove), 500);
//     }
//   }, [
//     board,
//     xIsNext,
//     gameMode,
//     getAIMove,
//     handleClick,
//     calculateWinner,
//     isDraw,
//   ]);

//   const getSuggestion = useCallback(() => {
//     if (
//       suggestionPoints > 0 &&
//       (gameMode === "player" || (gameMode === "ai" && xIsNext))
//     ) {
//       const suggestion = findBestMove(board, xIsNext ? "X" : "O");
//       setShowSuggestion(suggestion);
//       setSuggestionPoints((prev) => prev - 1);
//     }
//   }, [board, xIsNext, suggestionPoints, gameMode, findBestMove]);

//   const resetGame = useCallback(() => {
//     setBoard(Array(9).fill(null));
//     setXIsNext(true);
//     setWinningCombo(null);
//     setIsDraw(false);
//     setShowSuggestion(false);
//     setSuggestionPoints(3);
//   }, []);

//   const getSquareClass = useCallback(
//     (index) => {
//       let className =
//         "w-20 h-20 border border-gray-400 text-4xl font-bold focus:outline-none ";
//       if (winningCombo && winningCombo.includes(index)) {
//         className += "bg-green-500 ";
//       } else if (isDraw) {
//         className += "bg-yellow-300 ";
//       }
//       if (showSuggestion === index) {
//         className += "relative ";
//       }
//       return className;
//     },
//     [winningCombo, isDraw, showSuggestion]
//   );

//   const status = useMemo(() => {
//     const result = calculateWinner(board);
//     if (result) {
//       return `Winner: ${result.winner}`;
//     } else if (isDraw) {
//       return "It's a draw";
//     } else {
//       return `Next Player: ${xIsNext ? "X" : "O"}`;
//     }
//   }, [board, isDraw, calculateWinner, xIsNext]);

//   return (
//     <div className="flex flex-col items-center border-black rounded-lg p-4">
//       <div className="mb-4 text-2xl font-bold">Tic Tac Toe</div>
//       <div className="mb-4">
//         <button
//           className={`px-2 py-1 mr-2 ${
//             gameMode === "player" ? "bg-blue-500" : "bg-gray-300"
//           }`}
//           onClick={() => setGameMode("player")}
//         >
//           Player vs Player
//         </button>
//         <button
//           className={`px-2 py-1 ${
//             gameMode === "ai" ? "bg-blue-500" : "bg-gray-300"
//           }`}
//           onClick={() => setGameMode("ai")}
//         >
//           Player vs AI
//         </button>
//       </div>
//       {gameMode === "ai" && (
//         <div className="mb-4">
//           <select
//             value={aiDifficulty}
//             onChange={(e) => setAiDifficulty(e.target.value)}
//             className="p-2 border rounded"
//           >
//             <option value="easy">Easy</option>
//             <option value="medium">Medium</option>
//             <option value="hard">Hard</option>
//           </select>
//         </div>
//       )}
//       <div className="mb-4 text-xl font-bold">{status}</div>
//       <div className="grid grid-cols-3 gap-1 bg-white p-4 rounded-lg shadow-md">
//         {board.map((value, index) => (
//           <button
//             key={index}
//             className={getSquareClass(index)}
//             onClick={() => handleClick(index)}
//             disabled={value !== null || (gameMode === "ai" && !xIsNext)}
//           >
//             {value}
//             {showSuggestion === index && (
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//               </div>
//             )}
//           </button>
//         ))}
//       </div>
//       <div className="mt-4">
//         <button
//           className="bg-blue-500 hover:bg-blue-600 text-white text-sm p-2 rounded-lg focus:outline-none mr-2"
//           onClick={resetGame}
//         >
//           New Game
//         </button>
//         <button
//           className={`bg-red-500 hover:bg-red-600 text-white text-sm p-2 rounded-lg focus:outline-none ${
//             suggestionPoints === 0 || (gameMode === "ai" && !xIsNext)
//               ? "opacity-50 cursor-not-allowed"
//               : ""
//           }`}
//           onClick={getSuggestion}
//           disabled={
//             suggestionPoints === 0 ||
//             calculateWinner(board) ||
//             isDraw ||
//             (gameMode === "ai" && !xIsNext)
//           }
//         >
//           {suggestionPoints === 0 ? (
//             <div>No suggestions available.</div>
//           ) : (
//             <div>
//               Suggestion for {xIsNext ? "X" : "O"} ({suggestionPoints})
//             </div>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TicTacToeWithAI;




/* eslint-disable no-unused-vars */
// import React, { useState, useEffect, useCallback, useMemo } from "react";

// const TicTacToeWithAI = () => {
//   const [board, setBoard] = useState(Array(9).fill(null));
//   const [xIsNext, setXIsNext] = useState(true);
//   const [aiDifficulty, setAiDifficulty] = useState("medium");
//   const [gameMode, setGameMode] = useState("player");
//   const [winningCombo, setWinningCombo] = useState(null);
//   const [isDraw, setIsDraw] = useState(false);
//   const [suggestionPoints, setSuggestionPoints] = useState({ X: 2, O: 2 });
//   const [showSuggestion, setShowSuggestion] = useState(null);

//   const calculateWinner = useCallback((squares) => {
//     const lines = [
//       [0, 1, 2],
//       [3, 4, 5],
//       [6, 7, 8],
//       [0, 3, 6],
//       [1, 4, 7],
//       [2, 5, 8],
//       [0, 4, 8],
//       [2, 4, 6],
//     ];
//     for (let i = 0; i < lines.length; i++) {
//       const [a, b, c] = lines[i];
//       if (
//         squares[a] &&
//         squares[a] === squares[b] &&
//         squares[b] === squares[c]
//       ) {
//         return { winner: squares[a], combo: [a, b, c] };
//       }
//     }
//     return null;
//   }, []);

//   const minimax = useCallback(
//     (board, depth, isMaximizing, maxDepth = Infinity) => {
//       const result = calculateWinner(board);
//       if (result?.winner === "O") return 10 - depth;
//       if (result?.winner === "X") return depth - 10;
//       if (board.every((square) => square !== null) || depth === maxDepth)
//         return 0;

//       if (isMaximizing) {
//         let bestScore = -Infinity;
//         for (let i = 0; i < 9; i++) {
//           if (board[i] === null) {
//             board[i] = "O";
//             const score = minimax(board, depth + 1, false, maxDepth);
//             board[i] = null;
//             bestScore = Math.max(score, bestScore);
//           }
//         }
//         return bestScore;
//       } else {
//         let bestScore = Infinity;
//         for (let i = 0; i < 9; i++) {
//           if (board[i] === null) {
//             board[i] = "X";
//             const score = minimax(board, depth + 1, true, maxDepth);
//             board[i] = null;
//             bestScore = Math.min(score, bestScore);
//           }
//         }
//         return bestScore;
//       }
//     },
//     [calculateWinner]
//   );

//   const findBestMove = useCallback(
//     (board, player) => {
//       let bestScore = player === "X" ? Infinity : -Infinity;
//       let bestMove;
//       for (let i = 0; i < 9; i++) {
//         if (board[i] === null) {
//           board[i] = player;
//           const score = minimax(board, 0, player === "X");
//           board[i] = null;
//           if (player === "X" ? score < bestScore : score > bestScore) {
//             bestScore = score;
//             bestMove = i;
//           }
//         }
//       }
//       return bestMove;
//     },
//     [minimax]
//   );

//   const getRandomMove = useCallback((board) => {
//     const availableMoves = board.reduce((acc, square, index) => {
//       if (square === null) acc.push(index);
//       return acc;
//     }, []);
//     return availableMoves[Math.floor(Math.random() * availableMoves.length)];
//   }, []);

//   const getAIMove = useCallback(
//     (board) => {
//       switch (aiDifficulty) {
//         case "easy":
//           return getRandomMove(board);
//         case "medium":
//           return findBestMove(board, "O");
//         case "hard":
//           return findBestMove(board, "O");
//         default:
//           return getRandomMove(board);
//       }
//     },
//     [aiDifficulty, findBestMove, getRandomMove]
//   );

//   const handleClick = useCallback(
//     (i) => {
//       if (calculateWinner(board) || board[i]) {
//         return;
//       }
//       const newBoard = [...board];
//       newBoard[i] = xIsNext ? "X" : "O";
//       setBoard(newBoard);
//       setXIsNext(!xIsNext);
//       setShowSuggestion(null);
//     },
//     [board, xIsNext, calculateWinner]
//   );

//   useEffect(() => {
//     const result = calculateWinner(board);
//     if (result) {
//       setWinningCombo(result.combo);
//     } else if (board.every((square) => square !== null)) {
//       setIsDraw(true);
//     } else {
//       setWinningCombo(null);
//       setIsDraw(false);
//     }

//     if (gameMode === "ai" && !xIsNext && !result && !isDraw) {
//       const aiMove = getAIMove(board);
//       setTimeout(() => handleClick(aiMove), 500);
//     }
//   }, [
//     board,
//     xIsNext,
//     gameMode,
//     getAIMove,
//     handleClick,
//     calculateWinner,
//     isDraw,
//   ]);

//   const getSuggestion = useCallback(() => {
//     const currentPlayer = xIsNext ? "X" : "O";
//     if (
//       suggestionPoints[currentPlayer] > 0 &&
//       (gameMode === "player" || (gameMode === "ai" && xIsNext))
//     ) {
//       const suggestion = findBestMove(board, currentPlayer);
//       setShowSuggestion(suggestion);
//       setSuggestionPoints((prev) => ({
//         ...prev,
//         [currentPlayer]: prev[currentPlayer] - 1,
//       }));
//     }
//   }, [board, xIsNext, suggestionPoints, gameMode, findBestMove]);

//   const resetGame = useCallback(() => {
//     setBoard(Array(9).fill(null));
//     setXIsNext(true);
//     setWinningCombo(null);
//     setIsDraw(false);
//     setShowSuggestion(null);
//     setSuggestionPoints({ X: 2, O: 2 });
//   }, []);

//   const getSquareClass = useCallback(
//     (index) => {
//       let className =
//         "w-20 h-20 border border-gray-400 text-4xl font-bold focus:outline-none ";
//       if (winningCombo && winningCombo.includes(index)) {
//         className += "bg-green-500 ";
//       } else if (isDraw) {
//         className += "bg-yellow-300 ";
//       }
//       if (showSuggestion === index) {
//         className += "relative ";
//       }
//       return className;
//     },
//     [winningCombo, isDraw, showSuggestion]
//   );

//   const status = useMemo(() => {
//     const result = calculateWinner(board);
//     if (result) {
//       return `Winner: ${result.winner}`;
//     } else if (isDraw) {
//       return "It's a draw";
//     } else {
//       return `Next Player: ${xIsNext ? "X" : "O"}`;
//     }
//   }, [board, isDraw, calculateWinner, xIsNext]);

//   return (
//     <div className="flex flex-col items-center border-black rounded-lg p-4">
//       <div className="mb-4 text-2xl font-bold">Tic Tac Toe</div>
//       <div className="mb-4">
//         <button
//           className={`px-2 py-1 mr-2 ${
//             gameMode === "player" ? "bg-blue-500" : "bg-gray-300"
//           }`}
//           onClick={() => setGameMode("player")}
//         >
//           Player vs Player
//         </button>
//         <button
//           className={`px-2 py-1 ${
//             gameMode === "ai" ? "bg-blue-500" : "bg-gray-300"
//           }`}
//           onClick={() => setGameMode("ai")}
//         >
//           Player vs AI
//         </button>
//       </div>
//       {gameMode === "ai" && (
//         <div className="mb-4">
//           <select
//             value={aiDifficulty}
//             onChange={(e) => setAiDifficulty(e.target.value)}
//             className="p-2 border rounded"
//           >
//             <option value="easy">Easy</option>
//             <option value="medium">Medium</option>
//             <option value="hard">Hard</option>
//           </select>
//         </div>
//       )}
//       <div className="mb-4 text-xl font-bold">{status}</div>
//       <div className="grid grid-cols-3 gap-1 bg-white p-4 rounded-lg shadow-md">
//         {board.map((value, index) => (
//           <button
//             key={index}
//             className={getSquareClass(index)}
//             onClick={() => handleClick(index)}
//             disabled={value !== null || (gameMode === "ai" && !xIsNext)}
//           >
//             {value}
//             {showSuggestion === index && (
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//               </div>
//             )}
//           </button>
//         ))}
//       </div>
//       <div className="mt-4">
//         <button
//           className="bg-blue-500 hover:bg-blue-600 text-white text-sm p-2 rounded-lg focus:outline-none mr-2"
//           onClick={resetGame}
//         >
//           New Game
//         </button>
//         <button
//           className={`bg-red-500 hover:bg-red-600 text-white text-sm p-2 rounded-lg focus:outline-none ${
//             suggestionPoints[xIsNext ? "X" : "O"] === 0 || (gameMode === "ai" && !xIsNext)
//               ? "opacity-50 cursor-not-allowed"
//               : ""
//           }`}
//           onClick={getSuggestion}
//           disabled={
//             suggestionPoints[xIsNext ? "X" : "O"] === 0 ||
//             calculateWinner(board) ||
//             isDraw ||
//             (gameMode === "ai" && !xIsNext)
//           }
//         >
//           {suggestionPoints[xIsNext ? "X" : "O"] === 0 ? (
//             <div>No suggestions available.</div>
//           ) : (
//             <div>
//               Suggestion for {xIsNext ? "X" : "O"} ({suggestionPoints[xIsNext ? "X" : "O"]})
//             </div>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TicTacToeWithAI;



/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from "react";

const TicTacToeWithAI = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [history, setHistory] = useState([]);
  const [xIsNext, setXIsNext] = useState(true);
  const [aiDifficulty, setAiDifficulty] = useState("medium");
  const [gameMode, setGameMode] = useState("player");
  const [winningCombo, setWinningCombo] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [suggestionPoints, setSuggestionPoints] = useState({ X: 2, O: 2 });
  const [showSuggestion, setShowSuggestion] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });

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
        return { winner: squares[a], combo: [a, b, c] };
      }
    }
    return null;
  }, []);

  const minimax = useCallback(
    (board, depth, isMaximizing, maxDepth = Infinity) => {
      const result = calculateWinner(board);
      if (result?.winner === "O") return 10 - depth;
      if (result?.winner === "X") return depth - 10;
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
    (board, player) => {
      let bestScore = player === "X" ? Infinity : -Infinity;
      let bestMove;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = player;
          const score = minimax(board, 0, player === "X");
          board[i] = null;
          if (player === "X" ? score < bestScore : score > bestScore) {
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
        //   return findBestMove(board, "O");
         return Math.random() < 0.5
           ? findBestMove(board)
           : getRandomMove(board);
        case "hard":
          return findBestMove(board, "O");
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
      setHistory((prev) => [...prev, board]);
      setXIsNext(!xIsNext);
      setShowSuggestion(null);
    },
    [board, xIsNext, calculateWinner]
  );

  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinningCombo(result.combo);
      setScores((prevScores) => ({
        ...prevScores,
        [result.winner]: prevScores[result.winner] + 1,
      }));
    } else if (board.every((square) => square !== null)) {
      setIsDraw(true);
    } else {
      setWinningCombo(null);
      setIsDraw(false);
    }

    if (gameMode === "ai" && !xIsNext && !result && !isDraw) {
      const aiMove = getAIMove(board);
      setTimeout(() => handleClick(aiMove), 500);
    }
  }, [
    board,
    xIsNext,
    gameMode,
    getAIMove,
    handleClick,
    calculateWinner,
    isDraw,
  ]);

  const getSuggestion = useCallback(() => {
    const currentPlayer = xIsNext ? "X" : "O";
    if (
      suggestionPoints[currentPlayer] > 0 &&
      (gameMode === "player" || (gameMode === "ai" && xIsNext))
    ) {
      const suggestion = findBestMove(board, currentPlayer);
      setShowSuggestion(suggestion);
      setSuggestionPoints((prev) => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] - 1,
      }));
    }
  }, [board, xIsNext, suggestionPoints, gameMode, findBestMove]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setHistory([]);
    setXIsNext(true);
    setWinningCombo(null);
    setIsDraw(false);
    setShowSuggestion(null);
    setSuggestionPoints({ X: 2, O: 2 });
  }, []);

  const undoMove = useCallback(() => {
    if (history.length > 0) {
      setBoard(history[history.length - 1]);
      setHistory((prev) => prev.slice(0, -1));
      setXIsNext((prev) => !prev);
      setShowSuggestion(null);
    }
  }, [history]);

  const getSquareClass = useCallback(
    (index) => {
      let className =
        "w-20 h-20 border border-gray-400 text-4xl font-bold focus:outline-none ";
      if (winningCombo && winningCombo.includes(index)) {
        className += "bg-green-500 ";
      } else if (isDraw) {
        className += "bg-yellow-300 ";
      }
      if (showSuggestion === index) {
        className += "relative ";
      }
      return className;
    },
    [winningCombo, isDraw, showSuggestion]
  );

  const status = useMemo(() => {
    const result = calculateWinner(board);
    if (result) {
      return `Winner: ${result.winner}`;
    } else if (isDraw) {
      return "It's a draw";
    } else {
      return `Next Player: ${xIsNext ? "X" : "O"}`;
    }
  }, [board, isDraw, calculateWinner, xIsNext]);

  return (
    <div className="flex flex-col items-center border-black rounded-lg p-4">
      <div className="mb-2 text-2xl font-bold">Tic Tac Toe</div>
      <div className="mb-4">
        <button
          className={`px-2 py-1 text-sm mr-2 ${
            gameMode === "player" ? "bg-blue-500" : "bg-gray-300"
          }`}
          onClick={() => setGameMode("player")}
        >
          Player vs Player
        </button>
        <button
          className={`px-2 py-1 text-sm ${
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
            className="p-1 text-sm  border rounded"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}
      <div className="text-xl font-bold">{status}</div>
      <div className="grid grid-cols-3 gap-1 bg-white p-4 rounded-lg shadow-md">
        {board.map((value, index) => (
          <button
            key={index}
            className={getSquareClass(index)}
            onClick={() => handleClick(index)}
            disabled={value !== null || (gameMode === "ai" && !xIsNext)}
          >
            {value}
            {showSuggestion === index && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-red-500" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* <div className="flex justify-between mt-4 w-60">
        <div className="text-lg">X: {scores.X}</div>
        <div className="text-lg">O: {scores.O}</div>
      </div> */}

      <div className="flex justify-between mt-4 w-48">
        <div className="flex items-center bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-lg shadow-sm">
          <span className="font-semibold mr-1">X :</span>{" "}
          <span className="text-blue-500 font-bold">{scores.X}</span>
        </div>
        <div className="flex items-center bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-lg shadow-sm">
          <span className="font-semibold mr-1">O :</span>{" "}
          <span className="text-green-600 font-bold">{scores.O}</span>
        </div>
      </div>

      <div className="mt-4">
        <button
          className="px-2 py-2 text-xs bg-red-500 text-white rounded mr-2"
          onClick={getSuggestion}
          disabled={suggestionPoints[xIsNext ? "X" : "O"] <= 0}
        >
          Suggestion for {xIsNext ? "X" : "O"} (
          {suggestionPoints[xIsNext ? "X" : "O"]} left)
        </button>
        <button
          className="px-2 py-2 text-xs bg-blue-500 text-white rounded mr-2"
          onClick={resetGame}
        >
          Reset Game
        </button>
        <button
          className="px-2 py-2 text-xs bg-gray-500 text-white rounded"
          onClick={undoMove}
          disabled={history.length === 0}
        >
          Undo Move
        </button>
      </div>
    </div>
  );
};

export default TicTacToeWithAI;

import { useState, useEffect, useRef } from "react";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isBlueNext, setIsBlueNext] = useState(true);
  const [scores, setScores] = useState({ blue: 0, red: 0 });
  const hasMounted = useRef(false); // Correctly declare hasMounted using useRef


  useEffect(() => {
    const storedScores = localStorage.getItem("ticTacToeScores");
    if (storedScores) {
      try {
        const parsedScores = JSON.parse(storedScores);
        setScores(parsedScores);
        console.log(`Scores loaded from localStorage: ${storedScores}`);
      } catch (error) {
        console.error("Error parsing scores:", error);
      }
    } else {
      console.log("No scores found in localStorage. Initializing scores.");
    }
  }, []);
  useEffect(() => {
    if (hasMounted.current) {
      // Update localStorage whenever scores change
      try {
        localStorage.setItem("ticTacToeScores", JSON.stringify(scores));
        console.log(`Scores updated in localStorage: ${JSON.stringify(scores)}`);
      } catch (error) {
        console.error("Error storing scores:", error);
      }
    } else {
      hasMounted.current = true;
    }
  }, [scores]);

  const handleClick = (index) => {
    const newBoard = [...board];
    if (newBoard[index] || calculateWinner(board)) return;
    newBoard[index] = isBlueNext ? "blue" : "red";
    setBoard(newBoard);
    setIsBlueNext(!isBlueNext);
  };

  const calculateWinner = (board) => {
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
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const checkDraw = (board) => {
    return board.every((cell) => cell !== null);
  };

  const winner = calculateWinner(board);

  useEffect(() => {
    if (winner) {
      setScores((prevScores) => {
        const updatedScores = {
          ...prevScores,
          [winner]: prevScores[winner] + 1,
        };
        console.log(`Scores after win: ${JSON.stringify(updatedScores)}`);
        return updatedScores;
      });
      setTimeout(() => setBoard(Array(9).fill(null)), 1000);
    } else if (checkDraw(board)) {
      setTimeout(() => setBoard(Array(9).fill(null)), 1000);
    }
  }, [winner, board]);

  return (
    <div className="container mx-auto mt-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Tic-Tac-Toe</h1>
      <div className="flex justify-center mb-4">
        <div className="mr-4">
          <span className="text-blue-500 font-bold">Blue: {scores.blue}</span>
        </div>
        <div>
          <span className="text-red-500 font-bold">Red: {scores.red}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`w-16 h-16 flex items-center justify-center border-2 
                        ${cell === "blue" ? "bg-blue-500" : ""} 
                        ${cell === "red" ? "bg-red-500" : ""} 
                        ${!cell ? "bg-gray-100" : ""}`}
          ></div>
        ))}
      </div>
      {winner && (
        <div className="mt-4 text-2xl">
          <span className={`font-bold text-${winner}-500`}>
            {winner.charAt(0).toUpperCase() + winner.slice(1)} wins!
          </span>
        </div>
      )}
      {!winner && checkDraw(board) && (
        <div className="mt-4 text-2xl">
          <span className="font-bold text-gray-500">It's a draw!</span>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;

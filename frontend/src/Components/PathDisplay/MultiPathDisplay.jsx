import SearchBar from "../../Components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import Graph from "../Graph/Graph";
import MultiGraph from "../Graph/MultiGraph";
import PathTracker from "../../Components/PathTracker/PathTracker";
import { useEffect, useState } from "react";
function MultiPathDisplay({
  player1,
  player2,
  path,
  errorMessage,
  isMulti,
  onWin,
  onWinningPathFound,
  resultMessage,
  onNewGameClick,
  onResetPathsClick,
  winningPath,
  resetTrigger,
}) {
  const [resultM, setResultM] = useState(``);

  useEffect(() => {
    if (!resultMessage) return;

    setResultM(resultMessage);

    // Set a timer to clear the message after 2 seconds
    const timer = setTimeout(() => {
      setResultM("");
    }, 3000);

    // Cleanup timer if resultMessage changes or component unmounts
    return () => clearTimeout(timer);
  }, [resultMessage]);

  return (
    <div
      className="relative rounded w-full min-h-[550px] h-[75vh] flex items-center justify-center text-center"
      style={{
        backgroundColor: "#1db954",
        border: "2px solid white",
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,1) 1px, rgba(255,255,255,1) 2px, transparent 4px, transparent 150px)",
      }}
    >
      {/* Graph area */}
      {errorMessage ? (
        <p className="text-red-700 font-semibold">{errorMessage}</p>
      ) : path ? (
        <MultiGraph
          pathA={path.pathA}
          pathB={path.pathB}
          winner={path.winner}
          onWin={onWin}
          winningEdges={path.winningEdges}
          playerA={player1}
          playerB={player2}
          onWinningPathFound={onWinningPathFound}
          winningPath={winningPath}
        />
      ) : (
        <p className="text-gray-500">
          No path calculated yet. Enter players below.
        </p>
      )}

      {/* Best Path Tracker */}
      <div className="absolute bottom-1 ">
        <PathTracker winningPath={winningPath} resetTrigger={resetTrigger} />
      </div>

      {/* Buttons */}
      <div className="absolute bottom-1 left-1 flex gap-2">
        <button
          type="button"
          onClick={onNewGameClick}
          className="w-full inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm px-5 py-2.5 text-center transition-colors duration-300 border-2 border-black rounded-lg focus:outline-none"
        >
          {" "}
          New Game
        </button>
      </div>
      <div className="absolute bottom-1 right-1 flex gap-2">
        <button
          type="button"
          onClick={onResetPathsClick}
className="w-full inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm px-5 py-2.5 text-center transition-colors duration-300 border-2 border-black rounded-lg focus:outline-none"
    
        >
          Reset Paths
        </button>
      </div>

      {/* Result message */}
      {resultM && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black px-4 py-2 rounded-lg shadow-md border border-white">
          <p className="text-sm text-gray-800 dark:text-gray-100">{resultM}</p>
        </div>
      )}
    </div>
  );
}

export default MultiPathDisplay;

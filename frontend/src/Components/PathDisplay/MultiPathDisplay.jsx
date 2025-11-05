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
  resetTrigger
}) {
  const [resultM, setResultM] = useState(``);

  useEffect(() => {
    setResultM(resultMessage);
  }, [resultMessage]);

  return (
    <div className="relative bg-gray-100 rounded border-4 w-full min-h-[550px] h-[75vh] flex flex-col items-center justify-center text-center">
      {/* Graph area */}
      {errorMessage ? (
        <p className="text-red-600 font-semibold">{errorMessage}</p>
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
        />
      ) : (
        <p className="text-gray-500">
          No path calculated yet. Enter players below.
        </p>
      )}

      {/* Best Path Tracker */}
      <div className="mt-2 absolute bottom-1 ">
        <PathTracker winningPath={winningPath} resetTrigger={resetTrigger} />
      </div>

      {/* Buttons */}
      <div className="absolute bottom-1 left-1 flex gap-2">
        <button
          type="button"
          onClick={onNewGameClick}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium px-4 py-2"
        >
          New Game
        </button>
        </div>
        <div className="absolute bottom-1 right-1 flex gap-2">
        <button
          type="button"
          onClick={onResetPathsClick}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium px-4 py-2"
        >
          Reset Paths
        </button>
      </div>

      {/* Result message */}
      {resultM && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded shadow-md border border-gray-300 dark:border-gray-600">
          <p className="text-sm text-gray-800 dark:text-gray-100">{resultM}</p>
        </div>
      )}
    </div>
  );
}

export default MultiPathDisplay;

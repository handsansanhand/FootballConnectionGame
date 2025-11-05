import SearchBar from "../../Components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import Graph from "../Graph/Graph";
import MultiGraph from "../Graph/MultiGraph";
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
  onResetPathsClick
}) {
  //console.log("Initial multi path:", JSON.stringify(path, null, 2));
  const [resultM, setResultM] = useState(``);

  useEffect(() => {
    setResultM(resultMessage);
  }, [resultMessage]);
  return (
    <>
      <div className="relative mt-6 bg-gray-100 rounded border-4 border-red-500 w-full min-h-[550px] h-[75vh] flex items-center justify-center text-center">
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
          <button
            type="button"
            onClick={onNewGameClick}
            className="absolute bottom-1 left-1 bg-white dark:bg-gray-800 px-4 py-2 rounded shadow-md border border-gray-300 dark:border-gray-600 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            New Game
          </button>
                    <button
            type="button"
            onClick={onResetPathsClick}
            className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 px-4 py-2 rounded shadow-md border border-gray-300 dark:border-gray-600 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Reset Paths
          </button>
        {/* result message */}
        {resultM && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded shadow-md border border-gray-300 dark:border-gray-600">
            <p className="text-sm text-gray-800 dark:text-gray-100">
              {resultM}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
export default MultiPathDisplay;

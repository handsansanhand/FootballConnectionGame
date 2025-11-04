import { useEffect, useState } from "react";
import { formatWinningPath } from "../Graph/graphUtils";
import ViewShortestPathButton from "../Buttons/ViewShortestPathButton";
function WinningModal({
  show,
  onClose,
  onSubmit,
  winningPath,
  playerA,
  playerB,
}) {
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    console.log(`calling use effect in winning modal`);
    if (winningPath.length !== 0) {
      setFinalScore(winningPath.length - 1);
      formatWinningPath(winningPath);
    } else {
      console.log(`the path is empty`);
    }
  }, [winningPath]);
  return (
    <div
      id="enter-player-modal"
      tabIndex="-1"
      aria-hidden={!show}
      className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${
        show ? "flex" : "hidden"
      }`}
    >
      <div className="relative p-4 w-full max-w-4xl max-h-full">
        <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
          {/* Header */}
          <div className="items-center p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Path Found!
            </h3>
          </div>

          {/* Body */}
          <form className="p-4 md:p-5 flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
              <div className="text-3xl font-bold">
                {playerA} to {playerB}
              </div>
              {winningPath && winningPath.length > 0 ? (
                winningPath.map((edge, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="font-semibold">
                      {edge.from} → {edge.to}
                    </span>
                    <span className="text-sm text-gray-600">
                      Team: {edge.team} | Years: {edge.years}
                    </span>
                  </div>
                ))
              ) : (
                <p>No winning path found.</p>
              )}
              <div className="text-xl font-bold">
                Path found in {finalScore} connections.
              </div>
            </div>

            {/* Button at bottom right */}
            <div className="flex justify-between mt-4">
              <ViewShortestPathButton 
                playerA={playerA}
                playerB={playerB}
                path={winningPath}
              />
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WinningModal;

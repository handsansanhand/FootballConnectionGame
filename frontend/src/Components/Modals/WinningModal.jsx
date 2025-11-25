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
  const [playerAName, setPlayerAName] = useState(``);
  const [playerBName, setPlayerBName] = useState(``);

  useEffect(() => {
    console.log(`IN WIN MODAL WINNING PATH IS `, winningPath);
    if (winningPath.length !== 0) {
      setFinalScore(winningPath.length - 1);
      formatWinningPath(winningPath);

      const from = winningPath[0]?.from?.name;
      const to = winningPath[winningPath.length - 1]?.to?.name;
      setPlayerAName(from);
      setPlayerBName(to);
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
      <div
        className="relative bg-white rounded-lg shadow-lg border-4 border-black text-black flex flex-col"
        style={{ maxHeight: "85vh", width: "50vw", minWidth: "300px" }}
      >
        {/* Header */}
        <div className="items-center p-4 md:p-5 border-b border-gray-200 text-center">
          <h3 className="text-3xl font-semibold text-gray-900">Path Found!</h3>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 flex flex-col items-center justify-start space-y-4">
          {/* Player names, path entries, etc. */}
          <div className="text-xl text-center font-bold text-black-500">
            {playerAName || "?"} to {playerBName || "?"}
          </div>

          {winningPath && winningPath.length > 0 ? (
            winningPath.map((edge, i) => (
              <div
                key={i}
                className="flex flex-col items-center bg-gray-50 rounded-xl shadow-sm p-3 w-full md:w-3/4"
              >
                <div className="flex items-center justify-center space-x-4 bg-gray-50 rounded-xl shadow-sm p-3 w-full md:w-3/4">
                  {/* From Name */}
                  <div className="flex flex-col items-center w-24">
                    <span className="text-lg font-semibold text-black text-center break-words">
                      {edge.from.name}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="flex flex-col items-center justify-center w-8">
                    <span className="text-4xl font-bold text-gray-600">→</span>
                  </div>

                  {/* To Name */}
                  <div className="flex flex-col items-center w-24">
                    <span className="text-lg font-semibold text-black text-center break-words">
                      {edge.to.name}
                    </span>
                  </div>
                </div>

                <span className="text-sm text-gray-600 mt-2">
                  Team: <span className="font-medium">{edge.team}</span> |
                  Years: <span className="font-medium">{edge.years}</span>
                </span>
              </div>
            ))
          ) : (
            <p>No winning path found.</p>
          )}

          <div className="text-xl font-bold text-gray-800  text-center ">
            Path found in {finalScore} connection{finalScore !== 1 ? "s" : ""}.
          </div>
        </div>

        {/* Button row */}
        <div className="flex justify-between p-4 border-t border-gray-200">
          <ViewShortestPathButton
            playerA={playerA}
            playerB={playerB}
            path={winningPath}
          />
          <button
            type="button"
            onClick={onClose}
            className="inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm px-5 py-2.5 text-center transition-colors duration-300 border-4 border-black rounded-none focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default WinningModal;

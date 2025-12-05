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
    if (winningPath.length !== 0) {
      setFinalScore(winningPath.length - 1);
      formatWinningPath(winningPath);

      const from = winningPath[0]?.from?.name;
      const to = winningPath[winningPath.length - 1]?.to?.name;
      setPlayerAName(from);
      setPlayerBName(to);
    } else {
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
        {/* Header */}
        <div className="w-full flex justify-center items-center text-center">
          <h3 className="text-xl sm:text-2xl font-semibold text-center bg-white border-black border-4 border-b-0 px-5 py-0.5 sm:py-2">
            Path Found!
          </h3>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-5  bg-white border-4 border-black flex flex-col items-center justify-start space-y-4">
          {/* Player names, path entries, etc. */}
          <div className="text-l sm:text-xl text-center font-bold text-black-500">
            {playerAName || "?"} to {playerBName || "?"}
            
          </div>
        
          {winningPath && winningPath.length > 0 ? (
            winningPath.map((edge, i) => (
              <div
                key={i}
                className="flex flex-col items-center  rounded-xl shadow-sm p-1 w-full md:w-3/4"
                 style={{ backgroundColor: "#1db954" }}
              >
                <div
                  className="flex items-center justify-center space-x-2 rounded-lg shadow-sm p-3 w-full md:w-3/4"
                  style={{ backgroundColor: "#1db954" }}
                >
                  {/* From Name */}
                  <div className="flex flex-col items-center w-24">
                    <span className="text-sm sm:text-lg font-semibold text-black text-center break-words">
                      {edge.from.name}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="flex flex-col items-center justify-center w-8">
                    <span className="text-4xl font-bold text-black">→</span>
                  </div>

                  {/* To Name */}
                  <div className="flex flex-col items-center w-24">
                    <span className="text-sm sm:text-lg font-semibold text-black text-center break-words">
                      {edge.to.name}
                    </span>
                  </div>
                </div>

                <span
                  className="text-xs sm:text-sm text-gray-600 rounded-b-lg px-4 py-1"
                  style={{ backgroundColor: "#1db954" }}
                >
                  Team: <span className="font-medium">{edge.team}</span> |
                  Years: <span className="font-medium">{edge.years}</span>
                </span>
              </div>
            ))
          ) : (
            <p>No winning path found.</p>
          )}

          <div className="text-l sm:text-xl font-bold text-gray-800  text-center ">
            Path found in {finalScore} connection{finalScore !== 1 ? "s" : ""}.
          </div>
        </div>

        {/* Button row */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm px-5 py-2.5 text-center transition-colors duration-300 border-4 border-black rounded-none border-t-0 focus:outline-none"
          >
            Close
          </button>
          <ViewShortestPathButton
            playerA={playerA}
            playerB={playerB}
            path={winningPath}
          />
        </div>
      </div>
    </div>
  );
}

export default WinningModal;

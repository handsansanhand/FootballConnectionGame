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
    console.log(`IN WIN MODAL PLAYER A IS ` , JSON.stringify(playerA, null,2))
  }, []);

  useEffect(() => {
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
      <div className="relative p-4 w-full max-w-4xl max-h-full ">
        <div className="relative bg-white rounded-lg shadow-lg border-4 border-black text-black shadow-lg">
          {/* Header */}
          <div className="items-center p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200 text-center">
            <h3 className="text-3xl font-semibold text-gray-900">
              Path Found!
            </h3>
          </div>

          {/* Body */}
          <form className="p-4 md:p-5 flex flex-col h-full text-black">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4  text-black">
              <div className="text-xl font-bold text-black-500">
                {playerAName || "?"} to {playerBName || "?"}
              </div>

              {winningPath && winningPath.length > 0 ? (
                winningPath.map((edge, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center bg-gray-50 rounded-xl shadow-sm p-3 w-full md:w-3/4"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {/* From player */}
                      <div className="flex flex-col items-center">
                        <img
                          src={edge.from.image_url}
                          alt={edge.from.name}
                          className="w-12 h-12 rounded-full border"
                        />
                        <span className="text-sm font-semibold mt-1 text-black">
                          {edge.from.name}
                        </span>
                      </div>

                      <span className="text-xl font-bold text-gray-600">→</span>

                      {/* To player */}
                      <div className="flex flex-col items-center">
                        <img
                          src={edge.to.image_url}
                          alt={edge.to.name}
                          className="w-12 h-12 rounded-full border"
                        />
                        <span className="text-sm font-semibold mt-1 text-gray-800 text-black">
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

              <div className="text-xl font-bold text-gray-800">
                Path found in {finalScore} connection
                {finalScore !== 1 ? "s" : ""}.
              </div>
            </div>

            {/* Button row */}
            <div className="flex justify-between mt-4">
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default WinningModal;

import PlayerInput from "../PlayerInput/PlayerInput";
import { useEffect, useState } from "react";

function EnterPlayerModal({ show, onClose, onSubmit, newGameTrigger }) {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 640;

  useEffect(() => {
    setPlayer1(null);
    setPlayer2(null);
  }, [newGameTrigger]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!player1 || !player2) return; 
    onSubmit(player1, player2); 
    onClose(); 
  };

  const handleReset = (playerKey) => {
    if (playerKey === "player1") setPlayer1(null);
    if (playerKey === "player2") setPlayer2(null);
  };

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
        <div className="relative bg-white rounded-lg shadow-lg border-4 border-black ">
          {/* Header */}
          <div className="w-full flex justify-center items-center text-center p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
            <h3 className="text-2xl font-semibold text-center">
              Enter Two Players
            </h3>
          </div>

          {/* Body */}
          <form className="p-4 md:p-5 flex flex-col h-full" onSubmit={handleSubmit}>
            {/* Player inputs */}
            <div className="grid gap-4 flex-1 mb-4">
              <PlayerInput
                label="Player 1"
                playerKey="player1"
                setPlayer={setPlayer1}
                handleReset={handleReset}
                hasRandomChoice={true}
                stacked={isMobile}          // <-- pass stacked
                newGameTrigger={newGameTrigger}
              />
              <PlayerInput
                label="Player 2"
                playerKey="player2"
                setPlayer={setPlayer2}
                handleReset={handleReset}
                hasRandomChoice={true}
                stacked={isMobile}          // <-- pass stacked
                newGameTrigger={newGameTrigger}
              />
            </div>

            {/* Buttons at bottom right */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm px-5 py-2.5 text-center transition-colors duration-300 border-4 border-black rounded-none focus:outline-none"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={!player1 || !player2}
                className={`text-white inline-flex items-center font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-4 focus:outline-none 
                ${
                  !player1 || !player2
                    ? "bg-gray-400 cursor-not-allowed focus:ring-gray-300"
                    : "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                }`}
              >
                Find Path
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EnterPlayerModal;

import PlayerInput from "../PlayerInput/PlayerInput";
import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
function EnterPlayerModal({ show, onClose, onSubmit, newGameTrigger }) {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [activePlayerInput, setActivePlayerInput] = useState("player1");
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
        <div className="relative rounded-lg border-black ">
          {/* Header */}
          {!isMobile && (
            <div className="w-full flex justify-center items-center text-center">
              <h3 className="text-xl bg-white sm:text-2xl font-semibold text-center border-black sm:border-4 sm:border-b-0 sm:px-5 sm:py-2">
                Enter Two Players
              </h3>
            </div>
          )}

          {/* Body */}
          <form
            className="p-4 md:p-0 flex flex-col h-full"
            onSubmit={handleSubmit}
          >
            {/* Player inputs */}
            {/* MOBILE: toggle-style input selection */}
            {isMobile ? (
              <div className="flex flex-col gap-0 flex-1">
                {/* Toggle buttons */}
                <div className="flex justify-center gap-0 rounded-none">
                  <button
                    onClick={() => setActivePlayerInput("player1")}
                    type="button"
                    className={`flex-1 py-1 font-medium transition border-black border-4 border-b-0 ${
                      activePlayerInput === "player1"
                        ? "text-white"
                        : "bg-gray-300 text-black"
                    }`}
                    style={
                      activePlayerInput === "player1"
                        ? { backgroundColor: "#1db954" }
                        : {}
                    }
                  >
                    Player 1
                  </button>

                  <button
                    onClick={() => setActivePlayerInput("player2")}
                    type="button"
                    className={`flex-1 py-1 font-medium transition border-black border-4 border-b-0 border-l-0 ${
                      activePlayerInput === "player2"
                        ? "text-white"
                        : "bg-gray-300 text-black"
                    }`}
                    style={
                      activePlayerInput === "player2"
                        ? { backgroundColor: "#1db954" }
                        : {}
                    }
                  >
                    Player 2
                  </button>
                </div>

                {/* Player 1 input */}
                <div hidden={activePlayerInput !== "player1"}>
                  <PlayerInput
                    playerKey="player1"
                    setPlayer={setPlayer1}
                    handleReset={handleReset}
                    hasRandomChoice={true}
                    stacked={true}
                    newGameTrigger={newGameTrigger}
                  />
                </div>

                {/* Player 2 input */}
                <div hidden={activePlayerInput !== "player2"}>
                  <PlayerInput
                    playerKey="player2"
                    setPlayer={setPlayer2}
                    handleReset={handleReset}
                    hasRandomChoice={true}
                    stacked={true}
                    newGameTrigger={newGameTrigger}
                  />
                </div>
              </div>
            ) : (
              /* Desktop unchanged */
              <div className="grid flex-1 ">
                <PlayerInput
                  label="Player 1"
                  playerKey="player1"
                  setPlayer={setPlayer1}
                  handleReset={handleReset}
                  hasRandomChoice={true}
                  stacked={false}
                  newGameTrigger={newGameTrigger}
                />
                <PlayerInput
                  label="Player 2"
                  playerKey="player2"
                  setPlayer={setPlayer2}
                  handleReset={handleReset}
                  hasRandomChoice={true}
                  stacked={false}
                  newGameTrigger={newGameTrigger}
                  topBorder={false}
                />
              </div>
            )}

            {/* Buttons at bottom right */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className={`inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm px-5 py-2.5 text-center transition-colors border-t-0 border-4 duration-300 sm:border-4 sm:border-t-0 border-black rounded-none focus:outline-none `}
              >
                Close
              </button>
              <button
                type="submit"
                disabled={!player1 || !player2}
                className={`text-white inline-flex items-center font-medium border-t-0 border-4 border-black sm:border-4 sm:border-black rounded-none text-sm px-5 py-2.5 text-center sm:border-t-0 focus:ring-4 focus:outline-none 
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

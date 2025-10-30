import PlayerInput from "../PlayerInput/PlayerInput";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
function EnterPlayerModal({ show, onClose, onSubmit }) {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!player1 || !player2) return; // optional validation
    onSubmit(player1, player2); // pass back to parent
    onClose(); // close modal
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
        <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Enter Two Players
            </h3>
          </div>

          {/* Body */}
          <form
            className="p-4 md:p-5 flex flex-col h-full"
            onSubmit={handleSubmit}
          >
            {/* Player inputs */}
            <div className="grid gap-4 flex-1 mb-4">
              <PlayerInput
                label="Player 1"
                playerKey="player1"
                setPlayer={setPlayer1}
                handleReset={handleReset}
                hasRandomChoice={true}
              />
              <PlayerInput
                label="Player 2"
                playerKey="player2"
                setPlayer={setPlayer2}
                handleReset={handleReset}
                hasRandomChoice={true}
              />
            </div>

            {/* Button at bottom right */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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

import EnterPlayerModal from "../../Components/EnterPlayerModal/EnterPlayerModal";
import Graph from "../../Components/Graph/Graph";
import HomeButton from "../../Components/HomeButton/HomeButton";
import PathDisplay from "../../Components/PathDisplay/PathDisplay";
import { useState, useEffect } from "react";
import PlayerInput from "../../Components/PlayerInput/PlayerInput";
import { initializeGuessPath, makeGuess } from "../../Scripts/guessPlayer";
function GuessPath() {
  // initialize state from localStorage if available
  const [showModal, setShowModal] = useState(false);
  const [guessedPlayer, setGuessedPlayer] = useState(null);

  const [player1, setPlayer1] = useState(
    () => localStorage.getItem("player1") || null
  );
  const [player2, setPlayer2] = useState(
    () => localStorage.getItem("player2") || null
  );

  useEffect(() => {
    // only show modal if players aren't already set
    if (!player1 || !player2) {
      setShowModal(true);
    }
  }, [player1, player2]);

  //now it should make a guess
  useEffect(() => {
    if (guessedPlayer) {
      console.log("Updated guess is now:", guessedPlayer);
    }
  }, [guessedPlayer]);
  const handlePlayersSubmit = async (p1, p2) => {
    setPlayer1(p1);
    setPlayer2(p2);

    // persist to localStorage
    localStorage.setItem("player1", p1);
    localStorage.setItem("player2", p2);

    setShowModal(false); // hide modal after submission
    const path = await initializeGuessPath(p1, p2);
    console.log("Initial path:", JSON.stringify(path, null, 2));
    console.log("Selected Players:", p1, p2);
  };

  const resetPlayers = () => {
    setPlayer1(null);
    setPlayer2(null);
  };
  const errorMessage =
    !player1 || !player2 ? "Please select both players." : null;
  // Unconnected graph for now
  const unconnectedGraph =
    player1 && player2 ? { players: [player1, player2] } : null;
  return (
    <div className="p-4">
      <div className="absolute top-4 left-4">
        <HomeButton />
      </div>
      <h1 className="text-2xl font-bold mb-6 text-center">Enter Players</h1>

      <EnterPlayerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handlePlayersSubmit}
      />

      {/* Path segment here */}
      <PathDisplay
        player1={player1}
        player2={player2}
        path={unconnectedGraph}
        errorMessage={errorMessage}
      />
      {/* Guess a player here*/}
      <PlayerInput
        label={"Make a Guess"}
        hasRandomChoice={false}
        setPlayer={setGuessedPlayer}
        handleReset={() => setGuessedPlayer(null)}
      />
      {/* Reset players button here */}
      <button
        onClick={resetPlayers} // reset players
        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
      >
        New Game
      </button>
    </div>
  );
}

export default GuessPath;

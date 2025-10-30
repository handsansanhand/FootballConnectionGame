import EnterPlayerModal from "../../Components/EnterPlayerModal/EnterPlayerModal";
import Graph from "../../Components/Graph/Graph";
import HomeButton from "../../Components/HomeButton/HomeButton";
import PathDisplay from "../../Components/PathDisplay/PathDisplay";
import { useState, useEffect } from "react";
import PlayerInput from "../../Components/PlayerInput/PlayerInput";
import { initializeGuessPath, makeGuess } from "../../Scripts/guessPlayer";
import { simplifyPathJSON } from "../../Components/Graph/graphUtils";
import MultiPathDisplay from "../../Components/PathDisplay/MultiPathDisplay";
function GuessPath() {
  // initialize state from localStorage if available
  const [showModal, setShowModal] = useState(false);
  const [guessedPlayer, setGuessedPlayer] = useState(null);

  const [path, setPath] = useState(() => {
    const storedPath = localStorage.getItem("path");
    return storedPath ? JSON.parse(storedPath) : null;
  });

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
    if (guessedPlayer && path) {
      handleGuess(path, guessedPlayer);
    }
  }, [guessedPlayer]);

  //a guess has been made
  const handleGuess = async (path, guessedPlayer) => {
    if (!guessedPlayer) return;

    console.log("Current path:", JSON.stringify(path, null, 2));
    console.log("Guessing player:", guessedPlayer);

    const res = await makeGuess(path, guessedPlayer);
    console.log("Response path:", JSON.stringify(res, null, 2));

    // optionally update local state if backend returns updated data
    if (res.success) {
      setPath(res);
    }
  };

  //after players are initialized
  const handlePlayersSubmit = async (p1, p2) => {
    setPlayer1(p1);
    setPlayer2(p2);

    // persist to localStorage
    localStorage.setItem("player1", p1);
    localStorage.setItem("player2", p2);

    setShowModal(false); // hide modal after submission
    const path = await initializeGuessPath(p1, p2);
    console.log("Initial path:", JSON.stringify(path, null, 2));
    setPath(path);
    console.log("Selected Players:", p1, p2);
  };

  //a correct guess was made, update the graph and the connected graph
  useEffect(() => {
    if (path) {
      localStorage.setItem("path", JSON.stringify(path));

      // Only simplify and update if the path exists
      const simplified = simplifyPathJSON(path); // returns { pathA: {...}, pathB: {...} }
      setConnectedGraph(simplified);
      console.log(
        "Updated simplified graphs:",
        JSON.stringify(simplified, null, 2)
      );
    }
  }, [path]);

  const resetPlayers = () => {
    setPlayer1(null);
    setPlayer2(null);
  };
  const errorMessage =
    !player1 || !player2 ? "Please select both players." : null;
  // connected graph will start with the two initial players
  const [connectedGraph, setConnectedGraph] = useState(() => {
    const storedPath = localStorage.getItem("path");
    if (storedPath) {
      const parsed = JSON.parse(storedPath);
      const simplified = simplifyPathJSON(parsed);
      return {
        pathA: simplified.pathA || {
          players: [],
          teams: [],
          overlapping_years: [],
        },
        pathB: simplified.pathB || {
          players: [],
          teams: [],
          overlapping_years: [],
        },
      };
    }
    // default empty paths if no stored path
    return {
      pathA:
        player1 && player2
          ? { players: [player1], teams: [], overlapping_years: [] }
          : { players: [], teams: [], overlapping_years: [] },
      pathB:
        player1 && player2
          ? { players: [player2], teams: [], overlapping_years: [] }
          : { players: [], teams: [], overlapping_years: [] },
    };
  });

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
      <MultiPathDisplay
        player1={player1}
        player2={player2}
        path={connectedGraph}
        errorMessage={errorMessage}
        isMulti={true}
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

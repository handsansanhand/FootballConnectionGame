import EnterPlayerModal from "../../Components/EnterPlayerModal/EnterPlayerModal";
import Graph from "../../Components/Graph/Graph";
import HomeButton from "../../Components/Buttons/HomeButton";
import PathDisplay from "../../Components/PathDisplay/PathDisplay";
import { useState, useEffect, use } from "react";
import PlayerInput from "../../Components/PlayerInput/PlayerInput";
import { initializeGuessPath, makeGuess } from "../../Scripts/guessPlayer";
import { simplifyPathJSON } from "../../Components/Graph/graphUtils";
import MultiPathDisplay from "../../Components/PathDisplay/MultiPathDisplay";
import WinningModal from "../../Components/WinningModal/WinningModal";
import PathTracker from "../../Components/PathTracker/PathTracker";
function GuessPath() {
  // initialize state from localStorage if available
  const [showModal, setShowModal] = useState(false);
  const [winningModal, setWinningModal] = useState(false);
  const [guessedPlayer, setGuessedPlayer] = useState(null);
  const [isWinner, setIsWinner] = useState(false);
  const [winningPath, setWinningPath] = useState([]);
  const [wrongGuessTrigger, setWrongGuessTrigger] = useState(0);
  const [correctGuessTrigger, setCorrectGuessTrigger] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [resultMessage, setResultMessage] = useState("");
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

  useEffect(() => {
    setResultMessage(resultMessage);
  }, [resultMessage]);
  //a guess has been made
  const handleGuess = async (path, guessedPlayer) => {
    if (!guessedPlayer) return;

    const res = await makeGuess(path, guessedPlayer);

    if (res.success) {
      setResultMessage(`Found a connection for ${guessedPlayer}`);
      setCorrectGuessTrigger((prev) => prev + 1);
      setPath(res);
    } else {
      // Wrong guess → increment trigger
      setResultMessage(`Could not find a connection for ${guessedPlayer}`);
      setWrongGuessTrigger((prev) => prev + 1);
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
   // console.log("Initial path:", JSON.stringify(path, null, 2));
    setPath(path);
   // console.log("Selected Players:", p1, p2);
  };

  //a correct guess was made, update the graph and the connected graph
  useEffect(() => {
    if (path) {
      localStorage.setItem("path", JSON.stringify(path));

      // Only simplify and update if the path exists
      const simplified = simplifyPathJSON(path); // returns { pathA: {...}, pathB: {...} }
      setConnectedGraph(simplified);
  //console.log("Updated simplified graphs:", JSON.stringify(simplified, null, 2));
    }
  }, [path]);
  //DEBUG
  useEffect(() => {
    console.log("==== localStorage ====");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(key, ":", value);
    }
    console.log("=====================");
  }, []);
  useEffect(() => {
    if (isWinner && winningPath && winningPath.length > 0) {
      setWinningModal(true);
      setIsWinner(false); // reset immediately so next win can trigger again
    }
  }, [isWinner, winningPath]);

  const resetPlayers = () => {
    setIsWinner(false);
    setPlayer1(null);
    setPlayer2(null);
    setPath(null);
    setResultMessage(``);
    setConnectedGraph({
      pathA: { players: [], edges: [], teams: [], overlapping_years: [] },
      pathB: { players: [], edges: [], teams: [], overlapping_years: [] },
    });
    localStorage.removeItem("player1");
    localStorage.removeItem("player2");
    localStorage.removeItem("path");
    localStorage.removeItem("nodesA");
    localStorage.removeItem("nodesB");
    setResetCount((prev) => prev + 1);
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
        pathA: {
          edges: [],
          players: [],
          teams: [],
          overlapping_years: [],
          ...simplified.pathA,
        },
        pathB: {
          edges: [],
          players: [],
          teams: [],
          overlapping_years: [],
          ...simplified.pathB,
        },
      };
    }
    return {
      pathA: {
        edges: [],
        players: player1 ? [player1] : [],
        teams: [],
        overlapping_years: [],
      },
      pathB: {
        edges: [],
        players: player2 ? [player2] : [],
        teams: [],
        overlapping_years: [],
      },
    };
  });

  return (
    <div className="p-2">
      <div className="absolute top-4 left-4">
        <HomeButton />
      </div>
      <h1 className="text-2xl font-bold text-center">Enter Players</h1>

      <EnterPlayerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        resetTrigger={resetCount}
        onSubmit={handlePlayersSubmit}
        newGameTrigger={resetCount}
      />
      <WinningModal
        show={winningModal}
        onClose={() => {
          setWinningModal(false);
          setIsWinner(false); //reset flag so it can trigger again
          setWinningPath([]);
        }}
        winningPath={winningPath}
        playerA={player1}
        playerB={player2}
      />

      {/* Path segment here */}
      <MultiPathDisplay
        player1={player1}
        player2={player2}
        path={connectedGraph}
        errorMessage={errorMessage}
        isMulti={true}
        onWin={(won) => setIsWinner(won)}
        onWinningPathFound={(path) => setWinningPath(path)}
        resultMessage={resultMessage}
        onNewGameClick={resetPlayers}
      />
      {/* Guess a player here*/}
      <PlayerInput
        label={"Make a Guess"}
        hasRandomChoice={false}
        setPlayer={setGuessedPlayer}
        handleReset={() => setGuessedPlayer(null)}
        wrongGuessTrigger={wrongGuessTrigger}
        correctGuessTrigger={correctGuessTrigger}
        hasGuess={true}
        setResultMessage={setResultMessage}
      />
      {/* Best path tracker */}
      <PathTracker winningPath={winningPath} resetTrigger={resetCount} />
    </div>
  );
}

export default GuessPath;

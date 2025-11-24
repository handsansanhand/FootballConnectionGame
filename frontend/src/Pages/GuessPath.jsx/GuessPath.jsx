import EnterPlayerModal from "../../Components/Modals/EnterPlayerModal";
import Graph from "../../Components/Graph/Graph";
import HomeButton from "../../Components/Buttons/HomeButton";
import PathDisplay from "../../Components/PathDisplay/PathDisplay";
import { useState, useEffect, use } from "react";
import PlayerInput from "../../Components/PlayerInput/PlayerInput";
import { initializeGuessPath, makeGuess } from "../../Scripts/guessPlayer";
import { simplifyPathJSON } from "../../Components/Graph/graphUtils";
import MultiPathDisplay from "../../Components/PathDisplay/MultiPathDisplay";
import WinningModal from "../../Components/Modals/WinningModal";
import PathTracker from "../../Components/PathTracker/PathTracker";
import InfoButton from "../../Components/Buttons/InfoButton";
function GuessPath() {
  // initialize state from localStorage if available
  const [showModal, setShowModal] = useState(false);
  const [winningModal, setWinningModal] = useState(false);
  const [guessedPlayer, setGuessedPlayer] = useState(null);
  const [isWinner, setIsWinner] = useState(false);
  const [stopLoadingWinningModal, setStopLoadingWinningModal] = useState(false);
  const [winningPath, setWinningPath] = useState(() => {
    // 1. Check for stored winningPath first (the shortest path ever found)
    const stored = localStorage.getItem("winningPath");
    if (stored) return JSON.parse(stored);

    // 2. Fallback: Check if the *current* path is a winner and use its edges
    const storedPath = localStorage.getItem("path");
    if (storedPath) {
      const parsedPath = JSON.parse(storedPath);
      if (parsedPath.winner && parsedPath.winningEdges) {
        return parsedPath.winningEdges;
      }
    }
    return [];
  });
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
      setResultMessage(`Found a connection for ${guessedPlayer.name}`);
      setCorrectGuessTrigger((prev) => prev + 1);
      setPath(res);
    } else {
      // Wrong guess → increment trigger
      setResultMessage(`Could not find a connection for ${guessedPlayer.name}`);
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
    }
  }, [path]);
  //DEBUG
  useEffect(() => {
    //console.log("==== localStorage ====");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      //   console.log(key, ":", value);
    }
    //  console.log("=====================");
  }, []);
  useEffect(() => {
    // Must have a valid win and path
    if (!isWinner || !winningPath || winningPath.length === 0) return;

    // If we've already shown a modal for THIS path, don’t do it again.
    if (stopLoadingWinningModal) return;

    console.log(`Opening WIN modal for a path of length ${winningPath.length}`);

    setWinningModal(true);
    setStopLoadingWinningModal(true);
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
    localStorage.removeItem("winningPath");
    setResetCount((prev) => prev + 1);
    setShowModal(true);
    setStopLoadingWinningModal(false);
  };
  const resetPathsOnly = async () => {
    if (!player1 || !player2) return;

    console.log("Resetting paths but keeping players...");

    // Reinitialize path for the same players
    const newPath = await initializeGuessPath(player1, player2);
    setPath(newPath);
    const simplified = simplifyPathJSON(newPath);
    setConnectedGraph(simplified);

    localStorage.setItem("path", JSON.stringify(newPath));
    localStorage.removeItem("nodesA");
    localStorage.removeItem("nodesB");

    setResultMessage("Paths have been reset!");

    // Do NOT clear winningPath from localStorage; we want to remember old best
    setWinningPath((prev) => prev); // keep state, if needed
    setIsWinner(false);
  };
  const errorMessage = !player1 || !player2 ? "Press new game to begin." : null;
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
    <div className="h-screen flex flex-col overflow-hidden p-2">
      <div className="flex items-center justify-between w-full mx-auto">
        {/* Left: Home button */}
        <div>
          <HomeButton />
        </div>

        {/* Center: Title */}
        <h1 className="text-2xl font-bold text-center flex-1 m-0">
          Connect The Players
        </h1>

        {/* Right: Info button */}
        <div>
          <InfoButton textChoice={0} />
        </div>
      </div>
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
          //setWinningPath([]);
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
        onWinningPathFound={(newPath) => {
          console.log(
            `THERE HAS BEEN A WINNING PATH FOUND, NEW PATH: `,
            JSON.stringify(newPath, null, 2)
          );
          if (!newPath || newPath.length === 0) return;

          // 🛑 CRITICAL FIX: If a path has already been established AND the
          // win state is currently active, we assume this is a re-render
          // loop trying to re-assert the win, so we stop.
          // When the user closes the modal, setIsWinner(false) runs, allowing
          // the logic below to run again on the next *valid* guess.
          if (isWinner && winningPath.length > 0) {
            console.log(
              "Win already asserted and path established. Skipping re-trigger."
            );
            return;
          } // Compare it to the current best path length stored in state.

          const prevLength =
            winningPath.length > 0 ? winningPath.length : Infinity; // If the newly found path is shorter (or is the first path found)...

          if (newPath.length < prevLength || prevLength === Infinity) {
            console.log(`a better path was found`);
            localStorage.setItem("winningPath", JSON.stringify(newPath));
            setWinningPath(newPath);
            setIsWinner(true);
            setStopLoadingWinningModal(false);
          } else if (newPath.length === prevLength) {
            // ...or if it's an equal-length path that was just discovered.
            // NOTE: We only need to set isWinner here if it is currently FALSE.
            if (!isWinner) {
              setIsWinner(true);
            }
          }
        }}
        resultMessage={resultMessage}
        onNewGameClick={resetPlayers}
        onResetPathsClick={resetPathsOnly}
        winningPath={winningPath}
        resetTrigger={resetCount}
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
    </div>
  );
}

export default GuessPath;

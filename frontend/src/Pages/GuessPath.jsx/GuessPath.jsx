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
import LoadingPopup from "../../Components/Modals/LoadingPopup";
function GuessPath({ resetCount, setResetCount }) {
  // initialize state from localStorage if available
  const [showModal, setShowModal] = useState(false);
  const [winningModal, setWinningModal] = useState(false);
  const [guessedPlayer, setGuessedPlayer] = useState(null);
  const [isWinner, setIsWinner] = useState(false);
  const [stopLoadingWinningModal, setStopLoadingWinningModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  try {
    setIsLoading(true);
    const res = await makeGuess(path, guessedPlayer);

    if (res.success) {
      setResultMessage(`Found a connection for ${guessedPlayer.name}`);
      setCorrectGuessTrigger((prev) => prev + 1);
      setPath(res);
    } else {
      setResultMessage(`Could not find a connection for ${guessedPlayer.name}`);
      setWrongGuessTrigger((prev) => prev + 1);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};


  //after players are initialized
  const handlePlayersSubmit = async (p1, p2) => {
    setPlayer1(p1);
    setPlayer2(p2);
    localStorage.setItem("player1", p1);
    localStorage.setItem("player2", p2);

    setShowModal(false);

    try {
      setIsLoading(true); // show loading
      const path = await initializeGuessPath(p1, p2);
      setPath(path);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false); // hide loading
    }
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
    if (!isWinner || !winningPath || winningPath.length === 0) return;

    if (stopLoadingWinningModal) return;

    console.log(`Opening WINNING modal immediately.`);
    setWinningModal(true);
    setStopLoadingWinningModal(true);
  }, [isWinner, winningPath, stopLoadingWinningModal]);

  const resetPlayers = () => {
    setResetCount((prev) => prev + 1);
    setIsWinner(false);
    setPlayer1(null);
    setPlayer2(null);
    setPath(null);
    setWinningPath([]);
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
      
      {/*Header */}
      <div className="flex items-center justify-between w-full mx-auto mb-2">
        {/* Left: Home button */}
        <div>
          <HomeButton />
        </div>

        {/* Center: Title */}
        <h1 className="text-3xl font-bold text-center flex-1 m-0 text-white ">
          Connect The Players
        </h1>

        {/* Right: Info button */}
        <div>
          <InfoButton textChoice={0} />
        </div>
      </div>
      {isLoading && <LoadingPopup message="Loading..." />}
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
          if (!newPath || newPath.length === 0) return;

          const prevLength =
            winningPath.length > 0 ? winningPath.length : Infinity; // If the newly found path is shorter (or is the first path found)...

          if (newPath.length < prevLength || prevLength === Infinity) {
            // console.log(`a better path was found`);
            localStorage.setItem("winningPath", JSON.stringify(newPath));
            setWinningPath(newPath);
            setIsWinner(true);
            setTimeout(() => {
              setWinningModal(true);
              setStopLoadingWinningModal(true);
            }, 0);
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

import { getShortestPath } from "../../Scripts/getShortestPath";
import { useState, useEffect } from "react";
import PlayerInput from "../../Components/PlayerInput/PlayerInput";
import PathDisplay from "../../Components/PathDisplay/PathDisplay";
import HomeButton from "../../Components/Buttons/HomeButton";
import { edgesToGraphFormat } from "../../Components/Graph/graphUtils";
import InfoButton from "../../Components/Buttons/InfoButton";

function ShortestPath() {
  // read query parameters on mount
  const searchParams = new URLSearchParams(window.location.search);
  const initialPlayer1 = searchParams.get("playerA");
  const initialPlayer2 = searchParams.get("playerB");
  const initialPathLength = searchParams.get("pathLength"); // optional

  const [player1, setPlayer1] = useState(initialPlayer1 || null);
  const [player2, setPlayer2] = useState(initialPlayer2 || null);
  const [path, setPath] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (player1 && player2) {
      const fetchPath = async () => {
        try {
          setErrorMessage("");

          // Only use cached path if it matches the exact players
          const stored = sessionStorage.getItem("existingPath");
          let useStored = false;
          if (stored) {
            const existingEdges = JSON.parse(stored);
            const formattedExistingPath = edgesToGraphFormat(existingEdges);
            const formattedActualShortestPath = await getShortestPath(
              player1,
              player2
            );

            // Only use the cached path if it was for the same two players
            if (
              formattedExistingPath.player1 === player1 &&
              formattedExistingPath.player2 === player2
            ) {
              setPath(formattedExistingPath);
              useStored = true;
            }

            if (!useStored) {
              setPath(formattedActualShortestPath);
            }

            return;
          }

          // otherwise fetch a new shortest path
          const result = await getShortestPath(player1, player2);
          console.log("res: ", JSON.stringify(result, 2, null));
          setPath(result);
        } catch (error) {
          console.error("Error fetching shortest path:", error);
        }
      };

      fetchPath();
    }
  }, [player1, player2]);

  const handleReset = (which) => {
    setPath(null);
    setErrorMessage("");
    if (which === "player1") setPlayer1(null);
    if (which === "player2") setPlayer2(null);
  };

  return (
    <div className="p-2">
      <div className="absolute top-4 left-4">
        <HomeButton />
      </div>
      <h1 className="text-2xl font-bold mb-6 text-center">Enter Players</h1>
      <div className="absolute top-4 right-4">
        <InfoButton textChoice={1} />
      </div>
      {/* Path display */}
      <PathDisplay
        player1={player1}
        player2={player2}
        path={path}
        errorMessage={errorMessage}
        isMulti={false}
      />

      {/* Player inputs */}
      <div className="flex flex-col md:flex-row gap-2 text-center rounded-none">
        <PlayerInput
          label="Player 1"
          playerKey="player1"
          setPlayer={setPlayer1}
          handleReset={handleReset}
          hasRandomChoice={true}
          initialValue={player1}
        />
        <PlayerInput
          label="Player 2"
          playerKey="player2"
          setPlayer={setPlayer2}
          handleReset={handleReset}
          hasRandomChoice={true}
          initialValue={player2}
        />
      </div>
    </div>
  );
}

export default ShortestPath;

import { getShortestPath } from "../../Scripts/getShortestPath";
import { useState, useEffect } from "react";
import PlayerInput from "../../Components/PlayerInput/PlayerInput";
import PathDisplay from "../../Components/PathDisplay/PathDisplay";
import HomeButton from "../../Components/HomeButton/HomeButton";
function ShortestPath() {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [path, setPath] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (player1 && player2) {
      if (player1 === player2) {
        setErrorMessage("It can't be the same player!");
        setPath(null);
        return;
      }
      const fetchPath = async () => {
        try {
          setErrorMessage("");
          const result = await getShortestPath(player1, player2);
          setPath(result);
        } catch (error) {
          console.error("Error fetching shortest path:", error);
        }
      };
      fetchPath();
    }
  }, [player1, player2]);

  // Handle resets from child components
  const handleReset = (which) => {
    setPath(null);
    setErrorMessage("");
    if (which === "player1") setPlayer1(null);
    if (which === "player2") setPlayer2(null);
  };

  return (
    <div className="p-4">
      <div className="absolute top-4 left-4">
        < HomeButton />
      </div>
      <h1 className="text-2xl font-bold mb-6 text-center">Enter Players</h1>

      {/* Path display */}
      <PathDisplay
        player1={player1}
        player2={player2}
        path={path}
        errorMessage={errorMessage}
      />

      {/* Player inputs */}
      <div className="flex flex-col md:flex-row gap-6 mt-6 text-center">
        <PlayerInput
          label="Player 1"
          playerKey="player1"
          setPlayer={setPlayer1}
          handleReset={handleReset}
        />
        <PlayerInput
          label="Player 2"
          playerKey="player2"
          setPlayer={setPlayer2}
          handleReset={handleReset}
        />
      </div>
    </div>
  );
}

export default ShortestPath;

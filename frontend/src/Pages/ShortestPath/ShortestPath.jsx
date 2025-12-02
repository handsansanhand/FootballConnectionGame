import { getShortestPath } from "../../Scripts/getShortestPath";
import { useState, useEffect } from "react";
import PlayerInput from "../../Components/PlayerInput/PlayerInput";
import PathDisplay from "../../Components/PathDisplay/PathDisplay";
import HomeButton from "../../Components/Buttons/HomeButton";
import { edgesToGraphFormat } from "../../Components/Graph/graphUtils";
import InfoButton from "../../Components/Buttons/InfoButton";
import LoadingPopup from "../../Components/Modals/LoadingPopup";
function ShortestPath() {
  // read query parameters on mount
  const searchParams = new URLSearchParams(window.location.search);
  const initialPlayer1 = searchParams.get("playerA");
  const initialPlayer2 = searchParams.get("playerB");
  const [isLoading, setIsLoading] = useState(false);

  const [existingPlayerAName, setExistingPlayerAName] = useState("");
  const [existingPlayerBName, setExistingPlayerBName] = useState("");

  const initialPathLength = searchParams.get("pathLength"); // optional

  const [player1, setPlayer1] = useState(
    initialPlayer1 ? JSON.parse(initialPlayer1) : null
  );
  const [player2, setPlayer2] = useState(
    initialPlayer2 ? JSON.parse(initialPlayer2) : null
  );
  const [path, setPath] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 640;
  useEffect(() => {
    if (player1 && player2) {
      const id1 =
        typeof player1 === "object" && player1 !== null ? player1.id : player1;
      const id2 =
        typeof player2 === "object" && player2 !== null ? player2.id : player2;
      const fetchPath = async () => {
        try {
          setIsLoading(true); // start loading
          setErrorMessage("");

          // Only use cached path if it matches the exact players
          const stored = sessionStorage.getItem("existingPath");
          let useStored = false;

          if (stored) {
            const {
              edges,
              player1: storedP1,
              player2: storedP2,
            } = JSON.parse(stored);
            const formattedExistingPath = edgesToGraphFormat(edges);

            const formattedActualShortestPath = await getShortestPath(id1, id2);

            const actualPlayerAName = formattedActualShortestPath.playerA.name;
            const actualPlayerBName = formattedActualShortestPath.playerB.name;

            setExistingPlayerAName(actualPlayerAName);
            setExistingPlayerBName(actualPlayerBName);

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
          const result = await getShortestPath(id1, id2);
          setPath(result);
        } catch (error) {
          console.error("Error fetching shortest path:", error);
          setErrorMessage("Failed to fetch path.");
        } finally {
          setIsLoading(false); // stop loading
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
      <div className="flex items-center justify-between w-full mx-auto mb-2">
        {/* Left: Home button */}
        <div>
          <HomeButton />
        </div>

        {/* Center: Title */}
        <h1 className="text-3xl font-bold text-center flex-1 m-0 text-white ">
          Shortest Path Calculator
        </h1>

        {/* Right: Info button */}
        <div>
          <InfoButton textChoice={1} />
        </div>
      </div>
      {/* Path display */}
      {isLoading && (
        <LoadingPopup
          message="Calculating shortest path..."
          onClose={() => setIsLoading(false)}
        />
      )}
      <PathDisplay
        player1={player1}
        player2={player2}
        path={path}
        errorMessage={errorMessage}
        isMulti={false}
        isMobile={isMobile}
      />

      {/* Player inputs */}
      <div className="flex flex-col md:flex-row gap-2 text-center rounded-none">
        <PlayerInput
          label="Player 1"
          playerKey="player1"
          setPlayer={setPlayer1}
          handleReset={handleReset}
          hasRandomChoice={true}
          stacked={isMobile}
          initialValue={existingPlayerAName ? existingPlayerAName : ""}
        />
        <PlayerInput
          label="Player 2"
          playerKey="player2"
          setPlayer={setPlayer2}
          handleReset={handleReset}
          hasRandomChoice={true}
          stacked={isMobile}
          initialValue={existingPlayerBName ? existingPlayerBName : ""}
        />
      </div>
    </div>
  );
}

export default ShortestPath;

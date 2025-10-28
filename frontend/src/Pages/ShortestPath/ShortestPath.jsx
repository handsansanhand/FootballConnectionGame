import SearchBar from "../../Components/SearchBar/SearchBar";
import { getShortestPath } from "../../Scripts/getShortestPath";
import { getRandomPlayer } from "../../Scripts/players";
import { useState, useEffect } from "react";

function ShortestPath() {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [path, setPath] = useState(null);

  useEffect(() => {
    if (player1 && player2) {
      const fetchPath = async () => {
        try {
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
    if (which === "player1") setPlayer1(null);
    if (which === "player2") setPlayer2(null);
  };

  return (
    <div className="p-4">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => (window.location.href = "/")} // navigate home
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          Home
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-center">Enter Players</h1>

      {/* Path display */}
      <div className="relative mt-6 p-4 bg-gray-100 rounded border-4 border-red-500 min-h-[350px] md:min-h-[550px]">
        {path ? (
          <pre>{JSON.stringify(path, null, 2)}</pre>
        ) : (
          <p className="text-gray-500">
            No path calculated yet. Enter players below.
          </p>
        )}
      </div>

      {/* Player inputs */}
      {/* Player inputs */}
      <div className="flex flex-col md:flex-row gap-6 mt-6 text-center">
        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-300 dark:border-gray-600 shadow">
            <h2 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-200">
              Player 1
            </h2>
            <SearchBar
              onSubmit={(selected) => setPlayer1(selected)}
              onReset={() => handleReset("player1")}
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-300 dark:border-gray-600 shadow">
            <h2 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-200">
              Player 2
            </h2>
            <SearchBar
              onSubmit={(selected) => setPlayer2(selected)}
              onReset={() => handleReset("player2")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortestPath;

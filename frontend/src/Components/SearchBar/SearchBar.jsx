import React, { useState, useEffect, useRef } from "react";
import { searchPlayer } from "../../Scripts/searchPlayer";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const playerList = await searchPlayer(query);
        setResults(playerList);
      } catch (error) {
        console.error("Error searching player:", error);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelectPlayer = (player) => {
    setQuery(player);
    setResults([]);
    setSelectedPlayer(player);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSelectedPlayer(null);
  };

  return (
    <div className="max-w-md mx-auto relative">
      {/* Search input + inline button */}
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={handleChange}
          className="block w-full p-4 pr-20 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search for a player..."
        />

        {/* Enter button inside input, right aligned */}
        <button
          type="button"
          disabled={!selectedPlayer}
          className={`absolute top-1/2 end-1 -translate-y-1/2 py-2 px-4 rounded-lg text-white font-medium transition-colors text-sm ${
            selectedPlayer
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={() => {
            if (selectedPlayer) {
              console.log("Submitted player:", selectedPlayer);
              // handle submission logic here
            }
          }}
        >
          Enter
        </button>
      </div>

      {/* results dropdown */}
      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-auto">
          {results.map((player, index) => (
            <div
              key={index}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
              onClick={() => handleSelectPlayer(player)}
            >
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {player}
              </p>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && query.trim().length >= 2 && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          No players found.
        </p>
      )}
    </div>
  );
}

export default SearchBar;

import React, { useState, useEffect, useRef } from "react";
import { searchPlayer } from "../../Scripts/searchPlayer";

function SearchBar({ onSubmit, onReset }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [locked, setLocked] = useState(false); // lock state
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2 || locked) {
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
  }, [query, locked]);

  const handleSelectPlayer = (player) => {
    if (!locked) {
      setQuery(player);
      setResults([]);
      setSelectedPlayer(player);
    }
  };

  const handleChange = (e) => {
    if (!locked) {
      setQuery(e.target.value);
      setSelectedPlayer(null);
    }
  };

  const handleButtonClick = () => {
    if (!locked && selectedPlayer) {
      setLocked(true);
      if (onSubmit) onSubmit(selectedPlayer);
    } else if (locked) {
      setLocked(false);
      setQuery("");
      setSelectedPlayer(null);
      setResults([]);
      if (onReset) onReset(); // 🔹 clear path in parent
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Input + dynamic button */}
      <div className="relative w-full">
        <input
          type="search"
          value={query}
          onChange={handleChange}
          disabled={locked}
          className={`block w-full p-4 pr-28 ps-10 text-sm border rounded-lg ${
            locked
              ? "bg-gray-200 cursor-not-allowed text-gray-700"
              : "bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          }`}
          placeholder="Search for a player..."
        />

        <button
          type="button"
          onClick={handleButtonClick}
          className={`absolute top-1/2 end-1 -translate-y-1/2 py-2 px-4 rounded-lg text-white font-medium transition-colors text-sm ${
            locked
              ? "bg-red-600 hover:bg-red-700"
              : selectedPlayer
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!selectedPlayer && !locked}
        >
          {locked ? "Reset" : "Enter"}
        </button>

        {/* Results dropdown */}
        {!locked && results.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-1 z-10 bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-auto">
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
      </div>

      {!locked && results.length === 0 && query.trim().length >= 2 && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          No players found.
        </p>
      )}
    </div>
  );
}

export default SearchBar;

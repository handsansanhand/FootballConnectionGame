import React, { useState, useEffect, useRef } from "react";
import { searchPlayer, getRandomPlayer } from "../../Scripts/players";

function SearchBar({
  onSubmit,
  onReset,
  hasRandomChoice,
  initialValue,
  newGameTrigger,
  onValidChange
}) {
  const [query, setQuery] = useState(initialValue || "");
  const [results, setResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(initialValue || null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const debounceRef = useRef(null);

  // Reset state on new game trigger
  useEffect(() => {
    setQuery("");
    setSelectedPlayer(null);
    setDropdownOpen(false);
  }, [newGameTrigger]);

  // Handle initial value from parent
  useEffect(() => {
    if (initialValue) {
      setQuery(initialValue);
      setSelectedPlayer(initialValue);
      setDropdownOpen(false);
      onSubmit && onSubmit(initialValue);
    }
  }, [initialValue]);

  // Search whenever query changes
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setDropdownOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const playerList = await searchPlayer(query);
        setResults(playerList);

        // Only open dropdown if the current query is not a valid selected player
        if (!selectedPlayer || selectedPlayer !== query) {
          setDropdownOpen(playerList.length > 0);
        } else {
          setDropdownOpen(false);
        }
      } catch (error) {
        console.error("Error searching player:", error);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, selectedPlayer]);

  const handleSelectPlayer = (player) => {
    setQuery(player);
    setSelectedPlayer(player);
    setResults([]);
    setDropdownOpen(false);
    onSubmit && onSubmit(player);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSelectedPlayer(null); // clear selection until a valid player is chosen
    setDropdownOpen(true);
  };

  const handleRandom = async () => {
    try {
      const random = await getRandomPlayer();
      if (random.name) {
        setQuery(random.name);
        setSelectedPlayer(random.name);
        setResults([]);
        setDropdownOpen(false);
        onSubmit && onSubmit(random.name);
      }
    } catch (error) {
      console.error("Failed to fetch random player:", error);
    }
  };

  const isValid = selectedPlayer && selectedPlayer === query; // green only if selected player matches input
  // Notify parent about validity whenever it changes
  useEffect(() => {
    if (onValidChange) onValidChange(isValid ? selectedPlayer : null);
  }, [isValid, selectedPlayer, query]);
  return (
    <div className="w-full relative">
      <div className="relative flex items-center w-full">
        <input
          type="search"
          value={query}
          onChange={handleChange}
          className={`flex-1 p-4 text-md border-4 rounded-lg w-full ${
            isValid
              ? "border-green-500 bg-green-50 dark:bg-gray-700 text-white"
              : "border-gray-300 bg-gray-50 dark:bg-gray-700 text-white"
          }`}
          placeholder="Search for a player..."
        />

        <div className="flex gap-2 ml-2">
          {hasRandomChoice && (
            <button
              type="button"
              onClick={handleRandom}
              className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
            >
              Random
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedPlayer(null);
              setResults([]);
              setDropdownOpen(false);
              onReset && onReset();
            }}
            className="py-2 px-4 rounded-lg text-white font-medium transition-colors text-sm bg-red-600 hover:bg-red-700"
          >
            Reset
          </button>
        </div>
      </div>

      {dropdownOpen && (
        <div className="absolute top-full left-0 w-full mt-1 z-10 bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-auto">
          {results.length > 0 ? (
            results.map((player, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                onClick={() => handleSelectPlayer(player)}
              >
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {player}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center p-3">
              No players found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;

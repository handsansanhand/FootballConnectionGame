import React, { useState, useEffect, useRef } from "react";
import { searchPlayer, getRandomPlayer } from "../../Scripts/players";

function SearchBar({
  onSubmit,
  onReset,
  hasRandomChoice,
  wrongGuessTrigger,
  initialValue,
}) {
  const [query, setQuery] = useState(initialValue || "");
  const [results, setResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(initialValue || null);
  const [locked, setLocked] = useState(false);
  const debounceRef = useRef(null);
  const [wrongGuess, setWrongGuess] = useState(false);
  useEffect(() => {
    if (initialValue) {
      console.log(`initial input is ${initialValue}`)
      setQuery(initialValue);
      setSelectedPlayer(initialValue);
      setLocked(true);
      onSubmit && onSubmit(initialValue); 
    }
  }, [initialValue]);
  useEffect(() => {
    if (wrongGuessTrigger) {
      setWrongGuess(true);
      const timer = setTimeout(() => setWrongGuess(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [wrongGuessTrigger]);
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
      setSelectedPlayer(player);
      setResults([]);
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
      onSubmit && onSubmit(selectedPlayer);
    } else if (locked) {
      setLocked(false);
      setQuery("");
      setSelectedPlayer(null);
      setResults([]);
      onReset && onReset();
    }
  };

  const handleRandom = async () => {
    try {
      const random = await getRandomPlayer();
      if (random.name) {
        setQuery(random.name);
        setSelectedPlayer(random.name);
        setLocked(true);
        onSubmit && onSubmit(random.name);
      }
    } catch (error) {
      console.error("Failed to fetch random player:", error);
    }
  };

  return (
    <div className="w-full relative">
      {" "}
      {/* <-- full width of parent container */}
      <div className="relative flex items-center w-full">
        <input
          type="search"
          value={query}
          onChange={handleChange}
          disabled={locked}
          className={`flex-1 p-4 text-md border-4 rounded-lg w-full ${
            locked
              ? "bg-gray-50 dark:bg-gray-700 border-green-500 text-white cursor-default focus:ring-green-500 focus:border-green-500"
              : "bg-gray-50 dark:bg-gray-700 border-gray-300 text-white focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            onClick={handleButtonClick}
            className={`py-2 px-4 rounded-lg text-white font-medium transition-colors text-sm ${
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
        </div>
      </div>
      {/* Dropdown results */}
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
      {!locked && results.length === 0 && query.trim().length >= 2 && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          No players found.
        </p>
      )}
    </div>
  );
}

export default SearchBar;

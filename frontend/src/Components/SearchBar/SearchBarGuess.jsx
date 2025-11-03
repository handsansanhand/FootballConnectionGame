import React, { useState, useEffect, useRef } from "react";
import { searchPlayer, getRandomPlayer } from "../../Scripts/players";

function SearchBarGuess({
  onSubmit,
  onReset,
  hasRandomChoice,
  wrongGuessTrigger,
  correctGuessTrigger,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [wrongGuess, setWrongGuess] = useState(false);
  const [correctGuess, setCorrectGuess] = useState(false);
  const debounceRef = useRef(null);

  // Wrong guess effect
  useEffect(() => {
    if (wrongGuessTrigger) {
      setWrongGuess(true);
      setQuery(""); // reset input
      setSelectedPlayer(null);
      const timer = setTimeout(() => setWrongGuess(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [wrongGuessTrigger]);

  // Correct guess effect
  useEffect(() => {
    if (correctGuessTrigger) {
      setCorrectGuess(true);

      const timer = setTimeout(() => {
        setCorrectGuess(false); // remove green after 1s
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [correctGuessTrigger]);

  // Reset input after green flash
  useEffect(() => {
    if (!correctGuess) {
      setQuery("");
      setSelectedPlayer(null);
      onReset && onReset();
    }
  }, [correctGuess, onReset]);

  // Search debounce
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
    setSelectedPlayer(player);
    setResults([]);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSelectedPlayer(null);
  };

  const handleButtonClick = () => {
    if (selectedPlayer) {
      onSubmit && onSubmit(selectedPlayer);
    }
  };

  const handleRandom = async () => {
    try {
      const random = await getRandomPlayer();
      if (random.name) {
        setQuery(random.name);
        setSelectedPlayer(random.name);
        onSubmit && onSubmit(random.name);
      }
    } catch (error) {
      console.error("Failed to fetch random player:", error);
    }
  };

  return (
    <div className="w-full relative">
      <div className="relative flex items-center w-full">
        <input
          type="search"
          value={query}
          onChange={handleChange}
          className={`flex-1 p-4 text-md border-4 rounded-lg w-full
    bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100
    border-gray-300 focus:ring-blue-500 focus:border-blue-500
    transition-colors duration-500
    ${wrongGuess ? "border-red-500" : ""}
    ${correctGuess ? "border-green-500" : ""}
  `}
          placeholder="Search for a player ..."
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
              if (!selectedPlayer) return; // prevent submitting without a selection
              handleButtonClick();
            }}
            className={`py-2 px-4 rounded-lg text-white font-medium transition-colors text-sm ${
              selectedPlayer
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Enter
          </button>
        </div>
      </div>

      {/* Dropdown results */}
      {results.length > 0 && (
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

      {results.length === 0 && query.trim().length >= 2 && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          No players found.
        </p>
      )}
    </div>
  );
}

export default SearchBarGuess;

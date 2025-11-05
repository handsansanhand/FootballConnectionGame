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
  const [inputWidth, setInputWidth] = useState(0);
  const inputRef = useRef(null);
  const suppressSearchRef = useRef(false);
  const debounceRef = useRef(null);

  // Measure input width
  useEffect(() => {
    if (inputRef.current) setInputWidth(inputRef.current.offsetWidth);
    const handleResize = () => {
      if (inputRef.current) setInputWidth(inputRef.current.offsetWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Wrong guess effect
  useEffect(() => {
    if (wrongGuessTrigger) {
      setWrongGuess(true);
      setQuery("");
      setSelectedPlayer(null);
      const timer = setTimeout(() => setWrongGuess(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [wrongGuessTrigger]);

  // Correct guess effect
  useEffect(() => {
    if (correctGuessTrigger) {
      setCorrectGuess(true);
      const timer = setTimeout(() => setCorrectGuess(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [correctGuessTrigger]);

  useEffect(() => {
    if (!correctGuess) {
      setQuery("");
      setSelectedPlayer(null);
      onReset && onReset();
    }
  }, [correctGuess, onReset]);

  // Search debounce
  useEffect(() => {
    if (suppressSearchRef.current) {
      suppressSearchRef.current = false;
      return;
    }
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
    suppressSearchRef.current = true;
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSelectedPlayer(null);
  };

  const handleButtonClick = () => {
    if (selectedPlayer) onSubmit && onSubmit(selectedPlayer);
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
      <div className="flex items-center w-full">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          className={`flex-1 p-4 text-md rounded-none
  bg-white text-black
  border-4
  ${
    wrongGuess
      ? "border-red-500"
      : correctGuess
      ? "border-green-500"
      : "border-black"
  }
  transition-colors duration-500
  focus:outline-none focus:ring-0
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
              if (!selectedPlayer) return;
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
        <div
          className="absolute bottom-full left-0 mt-1 z-10 bg-white rounded-t-lg border-4 border-b-0 border-black shadow divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-auto"
          style={{ width: inputWidth }}
        >
          {results.map((player, index) => (
            <div
              key={index}
              className="p-3 hover:bg-green-700 hover:text-white cursor-pointer transition rounded-none"
              onClick={() => handleSelectPlayer(player)}
            >
              <p className="font-medium">{player}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBarGuess;

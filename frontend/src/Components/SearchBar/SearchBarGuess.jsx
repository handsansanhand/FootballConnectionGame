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
  const containerRef = useRef(null);
  // Measure input width
  useEffect(() => {
    if (inputRef.current) setInputWidth(inputRef.current.offsetWidth);
    const handleResize = () => {
      if (inputRef.current) setInputWidth(inputRef.current.offsetWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    setQuery(player.name);
    setSelectedPlayer(player);
    setResults([]);
    suppressSearchRef.current = true;
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSelectedPlayer(null);
  };

  const handleButtonClick = () => {
    if (selectedPlayer) onSubmit && onSubmit(selectedPlayer.name);
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
    <div className="w-full flex items-center">
      {/* Input + dropdown grouped together */}
      <div ref={containerRef} className="relative flex-1">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          className={`w-full p-4 text-md bg-white text-black border-4 rounded-none
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

        {/* Dropdown results (now perfectly aligned under input) */}
        {results.length > 0 && (
          <div
            className="absolute bottom-full left-0 mt-1 z-10 bg-white rounded-t-lg border-4 border-b-0 border-black shadow divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-auto"
            style={{ width: "100%" }}
          >
            {results.map((player, index) => (
              <div
                key={index}
                className="p-3 hover:bg-green-700 hover:text-white cursor-pointer transition"
                onClick={() => handleSelectPlayer(player)}
              >
                <p className="font-medium">{player.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 ml-2">
        {hasRandomChoice && (
          <button
            type="button"
            onClick={handleRandom}
            className="h-14 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            Random
          </button>
        )}

        <button
          type="button"
          onClick={() => selectedPlayer && handleButtonClick()}
          className={`h-14 px-8 rounded-lg text-white font-medium text-sm transition-colors ${
            selectedPlayer
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Enter
        </button>
      </div>
    </div>
  );
}

export default SearchBarGuess;

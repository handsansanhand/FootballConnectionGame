import React, { useState, useEffect, useRef } from "react";
import { searchPlayer, getRandomPlayer } from "../../Scripts/players";
import ErrorPopup from "../Modals/ErrorPopup";

function SearchBar({
  onSubmit,
  onReset,
  hasRandomChoice,
  initialValue,
  newGameTrigger,
  onValidChange,
  stacked = false, // <-- new prop
}) {
  const [query, setQuery] = useState(initialValue || "");
  const [results, setResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const debounceRef = useRef(null);
  const suppressSearchRef = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setQuery("");
    setSelectedPlayer(null);
    setDropdownOpen(false);
  }, [newGameTrigger]);

  useEffect(() => {
    if (initialValue) {
      const name =
        typeof initialValue === "string" ? initialValue : initialValue.name;
      setQuery(name);
      setSelectedPlayer(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    if (suppressSearchRef.current) {
      suppressSearchRef.current = false;
      return;
    }

    const searchText = typeof query === "string" ? query.trim() : "";
    if (searchText.length < 2) {
      setResults([]);
      setDropdownOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const playerList = await searchPlayer(searchText);
        setResults(playerList);
        setDropdownOpen(playerList.length > 0);
      } catch (error) {
        console.error("Error searching player:", error);
        setError("Server is unreachable");   // trigger toast
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelectPlayer = (player) => {
    suppressSearchRef.current = true;
    setQuery(player.name);
    setSelectedPlayer(player);
    setResults([]);
    setDropdownOpen(false);

    onSubmit && onSubmit(player.id);
    onValidChange && onValidChange(player.id);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSelectedPlayer(null);
    setDropdownOpen(true);
  };

  const handleRandom = async () => {
    try {
      const random = await getRandomPlayer();
      if (random?.name) {
        setQuery(random.name);
        setSelectedPlayer(random);
        setResults([]);
        setDropdownOpen(false);
        suppressSearchRef.current = true;
        onSubmit && onSubmit(random.id);
        onValidChange && onValidChange(random.id);
      }
    } catch (error) {
      console.error("Failed to fetch random player:", error);
      setError("Server is unreachable");     //trigger toast
    }
  };

  const handleReset = () => {
    setQuery("");
    setSelectedPlayer(null);
    setResults([]);
    setDropdownOpen(false);
    onReset && onReset();
  };

  const isValid = !!selectedPlayer;

  return (
    <div className={`w-full flex ${stacked ? "flex-col gap-2" : "items-center"}`}>
      <div className={`relative flex-1 ${stacked ? "w-full" : ""}`}>
        <input
          type="search"
          value={query}
          onChange={handleChange}
          className={`w-full p-4 text-md border-4 rounded-none
            ${
              isValid
                ? "border-green-500 bg-green-50"
                : "border-black bg-gray-50"
            }
            focus:outline-none focus:ring-0
          `}
          placeholder="Search for a player..."
        />

        {dropdownOpen && (
          <div className="absolute bottom-full left-0 w-full mt-1 z-10 bg-white rounded-t-lg border-4 border-b-0 border-black shadow max-h-60 overflow-auto">
            {results.length > 0 ? (
              results.map((player) => (
                <div
                  key={player.id}
                  className="p-3 hover:bg-green-700 hover:text-white cursor-pointer transition"
                  onClick={() => handleSelectPlayer(player)}
                >
                  <div className="flex items-center gap-3">
                    {player.image_url && (
                      <img
                        src={player.image_url}
                        alt={player.name}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                    )}
                    <p className="font-medium">{player.name}</p>
                  </div>
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

      {/* Buttons */}
      <div
        className={`flex gap-2 ${
          stacked ? "flex-row mt-2 justify-center gap-x-4" : "ml-2"
        }`}
      >
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
          onClick={handleReset}
          className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm"
        >
          Reset
        </button>
      </div>
      <ErrorPopup message={error} onClose={() => setError(null)} />
    </div>
  );
}

export default SearchBar;

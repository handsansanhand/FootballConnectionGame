import React, { useState, useEffect, useRef } from "react";
import { searchPlayer, getRandomPlayer } from "../../Scripts/players";

function SearchBar({
  onSubmit,
  onReset,
  hasRandomChoice,
  initialValue,
  newGameTrigger,
  onValidChange,
}) {
  const [query, setQuery] = useState(initialValue || "");
  const [results, setResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const debounceRef = useRef(null);

  // Reset on new game
  useEffect(() => {
    setQuery("");
    setSelectedPlayer(null);
    setDropdownOpen(false);
  }, [newGameTrigger]);

  // Handle initial value (string)
  useEffect(() => {
    if (initialValue) {
      // if initialValue is an object, use its name
      const name =
        typeof initialValue === "string" ? initialValue : initialValue.name;
      setQuery(name);
      setSelectedPlayer(initialValue);
    }
  }, [initialValue]);

  // --- SEARCH FUNCTIONALITY ---
  useEffect(() => {
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
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // --- SELECTION HANDLERS ---
  const handleSelectPlayer = (player) => {
    setQuery(player.name); // display name
    setSelectedPlayer(player); // store full player object
    setResults([]);
    setDropdownOpen(false);

    // Pass player ID to parent
    if (onSubmit) onSubmit(player.id);
    if (onValidChange) onValidChange(player.id);
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
        onSubmit && onSubmit(random.id);
        onValidChange && onValidChange(random.id);
      }
    } catch (error) {
      console.error("Failed to fetch random player:", error);
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

  // --- RENDER ---
  return (
    <div className="w-full flex items-center">
      <div className="relative flex-1">
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
          onClick={handleReset}
          className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default SearchBar;

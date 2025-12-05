import React, { useState, useEffect, useRef } from "react";
import { searchPlayer, getRandomPlayer } from "../../Scripts/players";
import ErrorPopup from "../Modals/ErrorPopup";
import { OrbitProgress } from "react-loading-indicators";

function SearchBar({
  onSubmit,
  onReset,
  hasRandomChoice,
  initialValue,
  newGameTrigger,
  onValidChange,
  stacked = false,
}) {
  const [query, setQuery] = useState(initialValue || "");
  const [results, setResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const debounceRef = useRef(null);
  const suppressSearchRef = useRef(false);
  const [error, setError] = useState(null);
  const [isRandomLoading, setIsRandomLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

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

    const searchText = query.trim();

    // only search if user typed (ignore if query is from initialValue)
    if (!searchText || searchText.length < 2) {
      setResults([]);
      setDropdownOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setIsSearchLoading(true);
        const playerList = await searchPlayer(searchText);
        setResults(playerList);
        setDropdownOpen(playerList.length > 0);
      } catch (error) {
        console.error("Error searching player:", error);
        setError("Server is unreachable");
      } finally {
        setIsSearchLoading(false);
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
    const value = e.target.value;
    setQuery(value);

    //only clear selectedPlayer if user actually types something different
    if (!selectedPlayer || selectedPlayer.name !== value) {
      setSelectedPlayer(null);
      setDropdownOpen(value.length >= 2);
    }
  };

  const handleRandom = async () => {
    try {
      setIsRandomLoading(true);
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
      setError("Server is unreachable. Please try again later."); //trigger toast
      setIsRandomLoading(false);
    }
    setIsRandomLoading(false);
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
    <div
      className={`${
        stacked ? "flex-col" : ""
      } w-full flex rounded-none sm:rounded-lg`}
    >
      {/* Search Input with loader */}
      <div className={`relative flex-1 ${stacked ? "w-full" : ""}`}>
        <input
          type="search"
          value={query}
          onChange={handleChange}
          className={`w-full p-3 sm:p-4 text-md sm:text-md bg-white text-black border-4 sm:border-r-0 rounded-none
      ${isValid ? "border-green-500 bg-green-50" : "border-black bg-gray-50"}
      focus:outline-none focus:ring-0 appearance-none`}
          placeholder="Search for a player..."
        />

        {dropdownOpen && (
          <div className="absolute bottom-full left-0 w-full mt-1 z-10 bg-white border-4 border-b-0 border-black shadow max-h-60 overflow-auto">
            {isSearchLoading ? (
              <div className="flex items-center justify-center p-3">
                <OrbitProgress color="#000" size="small" text="" textColor="" />
              </div>
            ) : results.length > 0 ? (
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
        className={`flex gap-0 rounded-none sm:border-4 sm:border-black ${
          stacked ? "flex-row mt-2 justify-center gap-x-0" : "ml-0"
        }`}
      >
        {hasRandomChoice && (
          <button
            type="button"
            onClick={handleRandom}
            className="py-2 sm:py-5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium flex items-center justify-center min-w-[4rem] border-4 border-black sm:border-0"
            disabled={isRandomLoading}
          >
            <div className="w-16 h-4 flex items-center justify-center">
              {isRandomLoading ? (
                <OrbitProgress
                  color="#fff"
                  size="small"
                  text=""
                  textColor=""
                  className="block"
                />
              ) : (
                <span className="leading-none">Random</span> // remove extra line-height
              )}
            </div>
          </button>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="
    px-4 sm:px-5 
    bg-red-600 hover:bg-red-700 
    text-white font-medium text-sm
    border-4 border-black       
    border-l-0                
    sm:border-l-4 sm:border-t-0 sm:border-r-0 sm:border-b-0 
  "
        >
          Reset
        </button>
      </div>
      <ErrorPopup message={error} onClose={() => setError(null)} />
    </div>
  );
}

export default SearchBar;

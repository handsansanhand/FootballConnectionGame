import { useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import SearchBarGuess from "../SearchBar/SearchBarGuess";

function PlayerInput({
  label,
  playerKey,
  setPlayer,
  handleReset,
  hasRandomChoice,
  wrongGuessTrigger,
  correctGuessTrigger,
  hasGuess, // new prop
  isMobile,
  initialValue,
  newGameTrigger,
  stacked = false,
  topBorder = true
}) {
  return (
    <div className={`flex-1 border-4 border-black rounded-none ${topBorder ? "border-t-4" : "border-t-0"}`}>
      <div className={`bg-gray-50 rounded-none p-2 sm:p-4 h-full`}>
        {!isMobile && (
          <h2 className="text-md sm:text-xl font-bold mb-2">{label}</h2>
        )}

        {hasGuess ? (
          <SearchBarGuess
            onSubmit={(selected) => setPlayer(selected)}
            onReset={() => handleReset(playerKey)}
            wrongGuessTrigger={wrongGuessTrigger}
            correctGuessTrigger={correctGuessTrigger}
          />
        ) : (
          <SearchBar
            onSubmit={(selected) => setPlayer(selected)}
            onReset={() => handleReset(playerKey)}
            hasRandomChoice={hasRandomChoice}
            wrongGuessTrigger={wrongGuessTrigger}
            initialValue={initialValue}
            newGameTrigger={newGameTrigger}
            onValidChange={(validPlayer) => setPlayer(validPlayer)}
            stacked={stacked}
          />
        )}
      </div>
    </div>
  );
}

export default PlayerInput;

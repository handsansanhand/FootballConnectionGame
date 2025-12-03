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
  initialValue,
  newGameTrigger,
  stacked=false
})


{
  
  return (
    <div className="flex-1 border-4 border-black rounded-lg">
      <div className="bg-gray-50 rounded-lg p-2 sm:p-4 h-full">
        <h2 className="text-md sm:text-xl font-bold mb-2">
          {label}
        </h2>

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

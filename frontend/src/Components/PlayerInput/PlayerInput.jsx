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
  
  useEffect(() => {
  //console.log(`INITIAL VAL = `, initialValue)
},[])
  return (
    <div className="flex-1 border-4 border-black rounded-lg mt-2">
      <div className="bg-gray-50 rounded-lg p-4 h-full">
        <h2 className="text-xl font-bold mb-2">
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

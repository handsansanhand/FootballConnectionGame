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
  newGameTrigger
}) {
  return (
    <div className="flex-1 border-2 border-red-500 mt-3">
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 rounded-none">
        <h2 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-200">
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
          />
        )}
      </div>
    </div>
  );
}

export default PlayerInput;

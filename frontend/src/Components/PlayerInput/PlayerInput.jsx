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
}) {
  return (
    <div className="flex-1">
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-300 dark:border-gray-600 shadow">
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
          />
        )}
      </div>
    </div>
  );
}

export default PlayerInput;

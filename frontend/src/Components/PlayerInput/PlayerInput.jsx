import SearchBar from "../SearchBar/SearchBar";

function PlayerInput({ label, playerKey, setPlayer, handleReset, hasRandomChoice }) {

  return (
    <>
      <div className="flex-1">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-300 dark:border-gray-600 shadow">
          <h2 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-200">
            { label }
          </h2>
          <SearchBar
            onSubmit={(selected) => setPlayer(selected)}
            onReset={() => handleReset(playerKey)}
            hasRandomChoice={hasRandomChoice}
          />
        </div>
      </div>
    </>
  );
}

export default PlayerInput;

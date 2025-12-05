import Graph from "../Graph/Graph";
function PathDisplay({ player1, player2, path, errorMessage, isMobile, onOpenPlayerModal  }) {
  return (
    <>
      <div
        className="relative rounded w-full h-[85vh] sm:h-[75vh] flex items-center justify-center text-center"
        style={{
          backgroundColor: "#1db954",
          border: "2px solid white",
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,1) 1px, rgba(255,255,255,1) 2px, transparent 4px, transparent 150px)",
        }}
      >
        {errorMessage ? (
          <p className="text-red-700 font-semibold">{errorMessage}</p>
        ) : path ? (
          <Graph
            pathJson={path}
            playerA={player1}
            playerB={player2}
            isMobile={isMobile}
          />
        ) : (
          <p className="text-md sm:text-l text-red-700 font-semibold">
            No path calculated yet. Enter players below.
          </p>
        )}
        {isMobile && (
          <button
            onClick={onOpenPlayerModal}// open the player input modal
            className="absolute bottom-1 inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm sm:text-md px-2 sm:px-5 py-1 sm:py-2.5 text-center transition-colors duration-300 border-2 border-black rounded-lg focus:outline-none"
          >
            Enter Players
          </button>
        )}
      </div>
    </>
  );
}
export default PathDisplay;

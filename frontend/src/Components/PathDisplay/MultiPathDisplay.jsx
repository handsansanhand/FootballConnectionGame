import SearchBar from "../../Components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import Graph from "../Graph/Graph";
import MultiGraph from "../Graph/MultiGraph";
function MultiPathDisplay( { player1, player2, path, errorMessage, isMulti} ) {
    console.log("Initial multi path:", JSON.stringify(path, null, 2));

  return (
    <>
      <div className="relative mt-6 bg-gray-100 rounded border-4 border-red-500 min-h-[350px] md:min-h-[550px] w-full h-[550px] flex items-center justify-center text-center">
        {errorMessage ? (
          <p className="text-red-600 font-semibold">{errorMessage}</p>
        ) : path ? (
          <MultiGraph pathA={path.pathA} pathB={path.pathB} />
        ) : (
          <p className="text-gray-500">
            No path calculated yet. Enter players below.
          </p>
        )}
      </div>
    </>
  );
}
export default MultiPathDisplay;

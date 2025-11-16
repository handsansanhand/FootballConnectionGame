import SearchBar from "../../Components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import Graph from "../Graph/Graph";
import { useEffect } from "react";
function PathDisplay( { player1, player2, path, errorMessage } ) {

  return (
    <>
      <div className="relative bg-gray-100 rounded border-4 border-red-500 w-full min-h-[550px] h-[75vh] flex items-center justify-center text-center">
        {errorMessage ? (
          <p className="text-red-600 font-semibold">{errorMessage}</p>
        ) : path ? (
          <Graph pathJson={path} playerA={player1} playerB={player2} />
        ) : (
          <p className="text-gray-500">
            No path calculated yet. Enter players below.
          </p>
        )}
      </div>
    </>
  );
}
export default PathDisplay;

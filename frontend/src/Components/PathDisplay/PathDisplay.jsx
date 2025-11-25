import SearchBar from "../../Components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import Graph from "../Graph/Graph";
import { useEffect } from "react";
function PathDisplay({ player1, player2, path, errorMessage, isMobile }) {
  return (
    <>
      <div
        className="relative rounded w-full min-h-[550px] h-[75vh] flex items-center justify-center text-center"
        style={{
          backgroundColor: "#1db954",
          border: "2px solid white",
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,1) 1px, rgba(255,255,255,1) 2px, transparent 4px, transparent 150px)"
        }}
      >
        {errorMessage ? (
          <p className="text-red-600 font-semibold">{errorMessage}</p>
        ) : path ? (
          <Graph
            pathJson={path}
            playerA={player1}
            playerB={player2}
            isMobile={isMobile}
          />
        ) : (
          <p className="text-red-800">
            No path calculated yet. Enter players below.
          </p>
        )}
      </div>
    </>
  );
}
export default PathDisplay;

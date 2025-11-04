import SearchBar from "../../Components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import Graph from "../Graph/Graph";
import { useEffect } from "react";
function PathDisplay( { path, errorMessage } ) {

  useEffect(() => {
    console.log(`the path that path display has got is `, JSON.stringify(path, null,2))
  },[path])
  return (
    <>
      <div className="relative mt-6 bg-gray-100 rounded border-4 border-red-500 w-full min-h-[550px] h-[75vh] flex items-center justify-center text-center">
        {errorMessage ? (
          <p className="text-red-600 font-semibold">{errorMessage}</p>
        ) : path ? (
          <Graph pathJson={path} />
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

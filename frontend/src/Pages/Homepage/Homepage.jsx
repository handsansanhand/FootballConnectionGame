import SearchBar from "../../Components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
function Homepage() {
    const navigate = useNavigate();
  return (
    <>
      <div className="App">
        <h1> TITLE HERE </h1>
        <div className="flex flex-col items-center gap-3 mb-6">
          <button
            type="button"
            className="inline-block text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Find path between two players
          </button>
          <button
            type="button"
            className="inline-block text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={() => navigate("/shortestPath")}
          >
            Calculate shortest path between two players
          </button>
        </div>
      </div>
    </>
  );
}
export default Homepage;

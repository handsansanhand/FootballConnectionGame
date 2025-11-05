import SearchBar from "../../Components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
function Homepage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="App min-h-screen flex flex-col justify-center items-center">
        <div className="App h-[60vh] flex flex-col items-center">
          <div className="">
            <h1 className="m-0 text-4xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-center">
              FOOTBALL CONNECTION GAME
            </h1>
          </div>
          <div className="flex flex-col items-center gap-5 w-full h-full justify-center">
            <div className="flex flex-col items-center gap-5 mb-6">
              <button
                type="button"
                className="w-full inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm px-5 py-2.5 text-center transition-colors duration-300 border-4 border-black rounded-none focus:outline-none"
                onClick={() => navigate("/guessPath")}
              >
                Find path between two players
              </button>
              <button
                type="button"
                 className="w-full inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm px-5 py-2.5 text-center transition-colors duration-300 border-4 border-black rounded-none focus:outline-none" onClick={() => navigate("/shortestPath")}
              >
                Calculate shortest path between two players
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Homepage;

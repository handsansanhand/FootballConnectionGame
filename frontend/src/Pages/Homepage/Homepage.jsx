import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Homepage.css";

function Homepage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // e.g., sm breakpoint
    handleResize(); // set on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="homepage-background min-h-screen w-full flex flex-col justify-center items-center">
      {!isMobile && (
        <>
          <div className="penalty-left"></div>
          <div className="penalty-right"></div>
          <div className="six-yard-left"></div>
          <div className="six-yard-right"></div>
          <div className="penalty-spot-left"></div>
          <div className="penalty-spot-right"></div>
          <div className="corner-top-left"></div>
          <div className="corner-top-right"></div>
          <div className="corner-bottom-left"></div>
          <div className="corner-bottom-right"></div>
        </>
      )}

      {/* Center spot (always rendered) */}
      <div className="center-spot"></div>

      {/* Page content */}
      <div className="App h-[60vh] flex flex-col items-center w-full max-w-4xl px-4">
        <h1 className="m-0 text-4xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-center mb-6">
          FOOTBALL CONNECTION GAME
        </h1>

        <div className="flex flex-col items-center gap-5 w-full justify-center">
          <button
            type="button"
            className="w-full inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm px-5 py-2.5 text-center transition-colors duration-300 border-4 border-black rounded-none focus:outline-none"
            onClick={() => navigate("/guessPath")}
          >
            Find path between two players
          </button>
          <button
            type="button"
            className="w-full inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm px-5 py-2.5 text-center transition-colors duration-300 border-4 border-black rounded-none focus:outline-none"
            onClick={() => navigate("/shortestPath")}
          >
            Calculate shortest path between two players
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;

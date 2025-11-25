import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Homepage.css";

function Homepage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // mobile breakpoint
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="homepage-background min-h-screen w-full flex flex-col items-center relative">
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

      {/* Center spot */}
      <div className="center-spot"></div>

      {/* Title */}
      <div className=" z-20 flex flex-col items-center w-full max-w-4xl px-4">
      <h1 className="absolute top-10 text-4xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-center w-full">
        FOOTBALL CONNECTION GAME
      </h1>

      {/* Buttons centered vertically */}
      <div className="flex items-center justify-center gap-12 absolute top-1/2 transform -translate-y-1/2 w-full max-w-4xl px-4">
        <button
          type="button"
          className="w-[250px] min-h-[60px] text-center text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-base px-4 py-3 break-words transition-colors duration-300 border-4 border-black rounded-none focus:outline-none"
          onClick={() => navigate("/guessPath")}
        >
          Find path between two players
        </button>
        <button
          type="button"
          className="w-[250px] min-h-[60px] text-center text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-base px-4 py-3 break-words transition-colors duration-300 border-4 border-black rounded-none focus:outline-none"
          onClick={() => navigate("/shortestPath")}
        >
          Calculate shortest path between two players
        </button>
      </div></div>
    </div>
  );
}

export default Homepage;

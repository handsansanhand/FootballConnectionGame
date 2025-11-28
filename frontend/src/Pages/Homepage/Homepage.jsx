import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Homepage.css";
import InfoButton from "../../Components/Buttons/InfoButton";

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
        <h1
          className="fade-delayed-1 absolute top-10 
             text-4xl sm:text-3xl md:text-4xl lg:text-6xl 
             font-bold text-center 
             px-10 py-5 
             border-white border-2 
             bg-black/70 
             text-white 
             rounded-lg"
        >
          Football Connector Tool
        </h1>

        {/* Buttons centered vertically */}
        <div className="fade-delayed-2 flex items-center justify-center gap-12 absolute top-1/2 transform -translate-y-1/2 w-full max-w-4xl px-4">
          <button
            type="button"
            className="w-[250px] min-h-[60px] text-center text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-base px-4 py-3 break-words transition-colors duration-300 border-4 border-black rounded-lg focus:outline-none"
            onClick={() => navigate("/guessPath")}
          >
            Connect The Players
          </button>
          <button
            type="button"
            className="w-[250px] min-h-[60px] text-center text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-base px-4 py-3 break-words transition-colors duration-300 border-4 border-black rounded-lg focus:outline-none"
            onClick={() => navigate("/shortestPath")}
          >
            Shortest Path Calculator
          </button>
        </div>
      </div>
      {/* ABOUT + DISCLAIMER BUTTON*/}
      <div
        className="absolute bottom-4 left-4"
      >
        <InfoButton textChoice={2} />
      </div>
    </div>
  );
}

export default Homepage;

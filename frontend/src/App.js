import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./Pages/Homepage/Homepage";
import ShortestPath from "./Pages/ShortestPath/ShortestPath";
import GuessPath from "./Pages/GuessPath.jsx/GuessPath";
import { useState } from "react";
function App() {
  const [resetCount, setResetCount] = useState(0);
  //style={{ backgroundColor: "rgb(37, 165, 26)" }}
  return (
    <Router basename="/">
      <div
        className="main-content min-h-screen "
        style={{ backgroundColor: "" }}
      >
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/shortestPath" element={<ShortestPath />} />
          <Route
            path="/guessPath"
            element={
              <GuessPath
                resetCount={resetCount}
                setResetCount={setResetCount}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

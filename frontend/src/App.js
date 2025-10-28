import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Homepage from './Pages/Homepage/Homepage';
import ShortestPath from "./Pages/ShortestPath/ShortestPath";
function App() {
  return (
    <Router basename="/">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/shortestPath" element={<ShortestPath />} />
            </Routes>
          </div>
        </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Homepage from './Pages/Homepage/Homepage';
function App() {
  return (
    <Router basename="/">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Homepage />} />
            </Routes>
          </div>
        </Router>
  );
}

export default App;

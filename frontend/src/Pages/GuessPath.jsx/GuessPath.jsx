import EnterPlayerModal from "../../Components/EnterPlayerModal/EnterPlayerModal";
import HomeButton from "../../Components/HomeButton/HomeButton";
import PathDisplay from "../../Components/PathDisplay/PathDisplay";
import { useState, useEffect } from "react";

function GuessPath() {
  // initialize state from localStorage if available
  const [showModal, setShowModal] = useState(false);
  const [player1, setPlayer1] = useState(() => localStorage.getItem("player1") || null);
  const [player2, setPlayer2] = useState(() => localStorage.getItem("player2") || null);

  useEffect(() => {
    // only show modal if players aren't already set
    if (!player1 || !player2) {
      setShowModal(true);
    }
  }, [player1, player2]);

  const handlePlayersSubmit = (p1, p2) => {
    setPlayer1(p1);
    setPlayer2(p2);

    // persist to localStorage
    localStorage.setItem("player1", p1);
    localStorage.setItem("player2", p2);

    setShowModal(false); // hide modal after submission
    console.log("Selected Players:", p1, p2);
  };

  return (
    <div className="p-4">
      <div className="absolute top-4 left-4">
        <HomeButton />
      </div>
      <h1 className="text-2xl font-bold mb-6 text-center">Enter Players</h1>

      <EnterPlayerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handlePlayersSubmit}
      />

      {player1 && player2 && (
        <div className="mt-6 text-center">
          <p>
            Selected Players: {player1} & {player2}
          </p>
        </div>
      )}
    </div>
  );
}

export default GuessPath;

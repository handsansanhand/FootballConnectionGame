import { useState } from "react";
import InfoModal from "../Modals/InfoModal";

function InfoButton({ textChoice }) {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = (input) => {
    setShowModal(input);
  };

  const titles = ["How To Play", "How To Use"];
  const infoText = [
    [
      "Connect two football players by finding a chain of teammates who played together.",
      "Enter two players, then guess players one by one who link them through shared teams.",
      "The game keeps track of your best connection path!",
      "NOTE: The database only includes players who have played after 1990.",
    ],
    [
      "Enter two players, and this page will show you the shortest path between the two through overlapping teammates.",
      "NOTE: The database only includes players who have played after 1990.",
    ],
  ];
  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="w-full inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm px-5 py-2.5 text-center transition-colors duration-300 border-4 border-black rounded-none focus:outline-none"  >
        Info
      </button>
      {showModal && (
        <InfoModal
          text={infoText[textChoice]}
          title={titles[textChoice]}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default InfoButton;

import { useState } from "react";
import InfoModal from "../Modals/InfoModal";

function InfoButton({ textChoice }) {
  const [showModal, setShowModal] = useState(false);


  const titles = ["How To Play", "How To Use", "Information"];
  const infoText = [
    [
      "Connect two football players by finding a chain of teammates who played together.",
      "Enter two players, then guess players one by one who link them through shared teams.",
      "The game keeps track of your best connection path!",
          <div className="font-bold">
        NOTE: The database only includes players who have played after 1990.
      </div>
    ],
    [
      "Enter two players, and this page will show you the shortest path between the two through overlapping teammates.",
      <div className="font-bold">
        NOTE: The database only includes players who have played after 1990.
      </div>
    ],
    [
      "This tool allows users to explore connections between football players, and also calculate shortest paths between players.",
      "The tool uses and works with player data stretching back to 1990 and does not include players before that time.",
      <>
        Developed by{" "}
        <a
          href="https://www.linkedin.com/in/jack-wright-018b52289/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:text-blue-400"
        >
          Jack Wright
        </a>
      </>,
      <div className="text-center">
        <strong>DISCLAIMERS</strong>
      </div>,
        <>
        Player data provided by{" "}
        <a
          href="https://www.transfermarkt.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:text-blue-400"
        >
          Transfermarkt  
        </a>
      {". "}All rights reserved to their respective owners.
      </>,
      "This site is for educational and entertainment purposes only.",
    ],
  ];
  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="w-full inline-block text-black bg-white hover:bg-black hover:text-white hover:border-white font-medium text-sm sm:text-md px-2 sm:px-5 py-1 sm:py-2.5 text-center transition-colors duration-300 border-2 border-black rounded-lg focus:outline-none"
      >
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

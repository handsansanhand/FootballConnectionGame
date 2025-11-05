import { useState } from "react";
import InfoModal from "../Modals/InfoModal";

function InfoButton({ textChoice }) {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = (input) => {
    setShowModal(input);
  };
  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="bg-white dark:bg-gray-800 px-4 py-2 rounded shadow-md border border-gray-300 dark:border-gray-600 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
      >
        Info
      </button>
      {showModal && (
        <InfoModal text={textChoice} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default InfoButton;

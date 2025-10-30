function WinningModal({ show, onClose, onSubmit }) {
  return (
    <div
      id="enter-player-modal"
      tabIndex="-1"
      aria-hidden={!show}
      className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${
        show ? "flex" : "hidden"
      }`}
    >
      <div className="relative p-4 w-full max-w-4xl max-h-full">
        <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Path Found!
            </h3>
          </div>

          {/* Body */}
          <form className="p-4 md:p-5 flex flex-col h-full">
            {/* Button at bottom right */}
            <div className="flex justify-end mt-auto">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WinningModal;
